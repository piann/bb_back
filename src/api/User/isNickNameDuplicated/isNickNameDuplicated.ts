import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export default{
    Query:{
        isNickNameDuplicated: async(_, args:any,{request }):Promise<boolean|null> =>{
            try{
                const {nickName} = args;
                const res:boolean = (await prisma.user.count({
                    where:{
                        nickName
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