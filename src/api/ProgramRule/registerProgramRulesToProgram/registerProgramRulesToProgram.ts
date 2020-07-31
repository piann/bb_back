import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerProgramRulesToProgram: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                const {bId, pIdList} = args;
                for(const pId of pIdList){
                    await prisma.programRuleConnBugBountyProgram.create({
                        data:{
                            programRule:{
                                connect:{id:pId}
                            },
                            bugBountyProgram:{
                                connect:{id:bId}
                            }
                        }
                    });
                }
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}