import { PrismaClient, FileCategory} from "@prisma/client";
import path from 'path';
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addReportFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {reportId, fileName} = args;
                if(isAuthenticated(request)===false){
                    console.log("should login first");
                    return null;
                }
                const {
                    user:{
                        id:uId,
                    }
                } = request;


                //// for test, no authorization
                /*
                const userObj:User|null = await prisma.user.findOne({
                    where:{id:userId}
                })
                
                
                // only ADMIN can write widely public file
                if( userObj==null || userObj.role!==Role.ADMIN){
                    console.log("forbidden access")
                    return null;
                }
                */

                const fileType = path.extname(fileName);
                console.log(fileType);////
                if(fileType!==".zip"){
                    return null;
                }
                const fileObj = await prisma.fileObj.create({
                    data:{
                        isPublic:true,
                        fileName,
                        fileType,
                        category:FileCategory.OTHERS,
                        uploadUser:{
                            connect:{id:uId}
                        }
                    }
                });
                const fileId = fileObj.id

                await prisma.report.update({
                    data:{
                        reportFile:{
                            connect:{id:fileId}
                        }
                    },
                    where:{
                        id:reportId
                    }
                });

                return fileId;
                
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}