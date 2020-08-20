import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export default{
    Query:{
        isEmailDuplicated: async(_, args:any,{request }):Promise<boolean|null> =>{
            try{
                const {email} = args;
                const res:boolean = (await prisma.user.count({
                    where:{
                        email
                    }
                }) >=1 );

                return res;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}