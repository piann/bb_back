import { PrismaClient, FileCategory, Role} from "@prisma/client";
import path from 'path';
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addLogoFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {fileName,companyId} = args;
                if(isAuthenticated(request)===false){
                    console.log("should login first");
                    return null;
                }
                const {
                    user:{
                        id:uId,
                        role,
                    }
                } = request;
                if( role!==Role.ADMIN){
                    console.log("forbidden access")
                    return null;
                }

                const companyObj = await prisma.company.findUnique({
                    where:{
                        id:companyId
                    }
                });

                if(companyObj===null){
                    return null;
                }

                const logoId = companyObj.logoId;
                
                const fileType = path.extname(fileName);

                let fileId:string|null=null;

                // if profile picture is new
                if(logoId===null||logoId===undefined){

                    const fileObj = await prisma.fileObj.create({
                        data:{
                            isPublic:true,
                            fileName,
                            fileType,
                            category:FileCategory.IMAGE,
                            uploadUser:{
                                connect:{id:uId}
                            }
                        }
                    });
                    fileId = fileObj.id;
                    await prisma.company.update({
                        data:{
                            logo:{
                                connect:{
                                    id:fileId
                                }
                            }
                        },
                        where:{
                            id:companyId
                        }
                    });

                    
                } else { // profile picture already exists

                    await prisma.fileObj.update({
                        data:{
                            fileName,
                            fileType,

                        },
                        where:{
                            id:logoId
                        }
                    })
                    
                    fileId = logoId;
                }


                return fileId;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}