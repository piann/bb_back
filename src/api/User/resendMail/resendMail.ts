import { PrismaClient, ReasonOfLock } from "@prisma/client";
import { sendAuthSecretMail } from "../../../utils";

const prisma = new PrismaClient()


export default{
    Mutation:{
        resendMail: async(_, args:any,{request }):Promise<boolean|null> =>{
            try{
                const {email} = args;
                const user = await prisma.user.findOne({
                    where:{
                        email:email
                    }
                });
                
                if(user===null){
                    return false;
                }

                const {
                    nickName,
                    authSecret,
                    isLocked,
                    reasonOfLock,
                } = user;

                if(isLocked===false){
                    return false;
                }

                if(reasonOfLock!==ReasonOfLock.NEW_ACCOUNT){
                    return false;
                }

                if (nickName === null || authSecret === null){
                    return false
                };

                const mailResult = await sendAuthSecretMail({
                    email,
                    nickName,
                    authSecret
                });

                if(mailResult===true){
                    return true;
                }

                return false;

            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}