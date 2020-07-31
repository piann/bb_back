import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerReportTipsToProgram: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                const {bId, rIdList} = args;
                for(const rId of rIdList){
                    await prisma.reportTipConnBugBountyProgram.create({
                        data:{
                            reportTip:{
                                connect:{id:rId}
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