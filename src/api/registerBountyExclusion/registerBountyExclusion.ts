import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export default{
    Mutation:{
        registerBountyExclusion: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root
                const {
                    bountyExclusionList,
                    bbpId
                } = args;

                for(var value of bountyExclusionList){
                    await prisma.bountyExclusion.create({
                        data:{
                            value,
                            bugBountyProgram:{
                                connect:{id:bbpId}
                            }

                        }
                    })
                }
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}