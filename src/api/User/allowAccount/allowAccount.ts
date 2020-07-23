import {prisma} from "../../../../generated/prisma-client"

export default{
    Mutation:{
        allowAccount: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                // add routine for check root

                const {userId} = args;
                // change lock status & company           
                await prisma.updateUser({data:{
                    isLocked:false,
                    reasonOfLock:{disconnect:true},
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