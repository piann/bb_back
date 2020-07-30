import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerProgramRuleToProgram: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                const {bId, pId} = args;

                await prisma.programRuleConnBugBounty.create({
                    data:{
                        programRule:{
                            connect:{id:pId}
                        },
                        bugBountyProgram:{
                            connect:{id:bId}
                        }
                    }
                });
                
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}