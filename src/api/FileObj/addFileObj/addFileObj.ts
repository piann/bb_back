import { PrismaClient, FileCategory, Role} from "@prisma/client";
import path from 'path';
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {fileName} = args;
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
                /*
                const userObj:User|null = await prisma.user.findUnique({
                    where:{id:userId}
                })
                
                
                // only ADMIN can write widely public file
                if( userObj==null || userObj.role!==Role.ADMIN){
                    console.log("forbidden access")
                    return null;
                }
                */

                const fileType = path.extname(fileName);
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

                return fileObj.id;
                
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}