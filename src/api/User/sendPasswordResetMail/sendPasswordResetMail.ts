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
                    id:uId,
                    nickName,
                    isLocked,
                    reasonOfLock
                } = user;

                if(isLocked===true && reasonOfLock!==ReasonOfLock.NEW_ACCOUNT){
                    return false;
                } // Locked account can't be entered by this load. but new account is ok.

                const dummy = Math.ceil(Math.random()*1234567890+1234567890123456789).toString(36).substring(6,12) // length 6 dummy
                const randomHex = crypto.randomBytes(42).toString('hex');
                const passwordResetSecret = dummy+ uId + randomHex; //6 + 25 + 84
                
                await prisma.user.update({
                    data:{
                        passwordResetSecret:{
                            set:passwordResetSecret
                        }
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