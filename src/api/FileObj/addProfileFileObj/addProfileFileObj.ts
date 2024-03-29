import { PrismaClient, FileCategory} from "@prisma/client";
import path from 'path';
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addProfileFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {fileName} = args;
                if(isAuthenticated(request)===false){
                    console.log("should login first");
                    return null;
                }
                const {
                    user:{
                        id:uId,
                        picId
                    }
                } = request;


                const fileType = path.extname(fileName);

                let fileId:string|null=null;

                // if profile picture is new
                if(picId===null||picId===undefined){

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
                    await prisma.user.update({
                        data:{
                            profilePicture:{
                                connect:{
                                    id:fileId
                                }
                            }
                        },
                        where:{
                            id:uId
                        }
                    });

                    
                } else { // profile picture alreadu exists

                    await prisma.fileObj.update({
                        data:{
                            fileName,
                            fileType,
                        },
                        where:{
                            id:picId
                        }
                    })
                    
                    fileId = picId;
                }


                return fileId;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}