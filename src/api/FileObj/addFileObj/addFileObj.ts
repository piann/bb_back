import { PrismaClient, FileCategory} from "@prisma/client";
import path from 'path';

const prisma = new PrismaClient()

export default{
    Mutation:{
        addFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {userId, fileName} = args;
                console.log(userId);

                //// for test, no authorization
                /*
                // only ADMIN can widely public file
                const userObj:User|null = await prisma.user.findOne({
                    where:{id:userId}
                })

                // no authorization
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