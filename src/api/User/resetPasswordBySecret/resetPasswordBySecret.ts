import { PrismaClient } from "@prisma/client";
import { generateSaltedHash } from "../../../utils";

const prisma = new PrismaClient()



export default{
    Mutation:{
        resetPasswordBySecret: async(_, args:any,{request}):Promise<Boolean> =>{
            try{
                const {key, newPassword} = args;
                // key : 6 + 25 + 84

                if(key.length!==6+25+84){
                    return false;
                }

                const uId = key.substring(6,6+25);
                const passwordResetSecret = key;

                const userObj = await prisma.user.findOne({
                    where:{
                        id:uId
                    }
                });

                if(userObj===null){
                    return false;
                }

                const savedSecret = userObj.passwordResetSecret;
                if(passwordResetSecret !== savedSecret){
                    return false;
                }
         
                const resultObj = await prisma.user.update({
                    data:{
                        passwordResetSecret:null,
                        passwordHash:generateSaltedHash(newPassword),
                    }, 
                    where:{id:uId}
                });
                
                if(resultObj!==null){
                    return true;
                }

                return false;

            }catch(err){
                console.log(err);
                return false
            }
        }
    }
}
