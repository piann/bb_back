import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        allowAccount: async(_, args:any,{request}):Promise<boolean> =>{
            // Unlock the account. when user register account, default state is locked state.
            try{
                //// add routine for check root

                const {userId} = args;
                // change lock status & company           
                await prisma.user.update({data:{
                    isLocked:{
                        set:false
                    },
                    reasonOfLock:{
                        set:null
                    },
                }, 
                where:{id:userId}
                });
                
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}