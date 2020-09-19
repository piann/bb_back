import { PrismaClient, ReasonOfLock } from "@prisma/client";
import { sendPasswordResetSecretMail } from "../../../utils";
import crypto from "crypto";

const prisma = new PrismaClient()


export default{
    Mutation:{
        sendPasswordResetMail: async(_, args:any,{request }):Promise<boolean|null> =>{
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
                    isLocked,
                    reasonOfLock
                } = user;

                if(isLocked===true && reasonOfLock!==ReasonOfLock.NEW_ACCOUNT){
                    return false;
                } // Locked account can't be entered by this load. but new account is ok.


                const randomHex1 = crypto.randomBytes(14).toString('hex');
                const uHex = crypto.createHmac('md5',"@emailHash").update(email).digest('hex');
                const randomHex2 = crypto.randomBytes(14).toString('hex');
                const passwordResetSecret = randomHex1 + uHex + randomHex2;

                await prisma.user.update({
                    data:{
                        passwordResetSecret
                    },
                    where:{
                        email
                    }
                });

                const mailResult = await sendPasswordResetSecretMail({
                    email,
                    nickName,
                    secret:passwordResetSecret
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