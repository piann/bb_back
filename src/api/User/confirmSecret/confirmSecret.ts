import { PrismaClient } from "@prisma/client";
import { generateToken } from "src/utils";

const prisma = new PrismaClient()

interface ConfirmSecretResponse{
    ok:Boolean;
    error:String|null;
    token:String|null;
}

export default{
    Mutation:{
        confirmSecret: async(_, args:any,{request}):Promise<ConfirmSecretResponse> =>{
            // Unlock the account. when user register account, default state is locked state.
            try{

                const {authSecret} = args;

                const userList = await prisma.user.findMany({
                    where:{
                        authSecret
                    }
                })
                
                if(userList.length == 0){
                    return {
                        ok:false,
                        error:"Invalid Access",
                        token:null
                    };
                }

                if(userList.length > 1){
                    throw new Error("Collision in AuthSecret");
                }
                const userId = userList[0].id

                // change lock status & company           
                await prisma.user.update({data:{
                    isLocked:false,
                    reasonOfLock:null,
                    authSecret:null
                }, 
                where:{id:userId}
                });
                
                return {
                    ok:true,
                    error:null,
                    token:generateToken(userId)
                };
            }catch(err){
                console.log(err);
                return {
                    ok:false,
                    error:err,
                    token:null
                }
            }
        }
    }
}