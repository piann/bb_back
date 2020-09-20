import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        allowAccount: async(_, args:any,{request}):Promise<boolean> =>{
            // Unlock the account. when user register account, default state is locked state.
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }

                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                const {userId} = args;
                // change lock status & company           
                await prisma.user.update({data:{
                    isLocked:false,
                    reasonOfLock:null,
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