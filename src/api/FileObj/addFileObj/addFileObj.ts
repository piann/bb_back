import { PrismaClient, FileCategory} from "@prisma/client";
import path from 'path';

const prisma = new PrismaClient()

export default{
    Mutation:{
        addFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {userId, fileName} = args;
                console.log(userId);
                const {
                    user:{
                        id:uId,
                    }
                } = request;
                console.log(uId);////
                console.log("###");////
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
                const fileObj = await prisma.fileObj.create({
                    data:{
                        isPublic:true,
                        fileName,
                        fileType,
                        category:FileCategory.OTHERS
                        
                    }
                })
                const fileObjId = fileObj.id;

                
                return fileObjId;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}