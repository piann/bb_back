import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addReportTips: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                const {valueList} = args;
                for (const value of valueList){
                    
                    await prisma.reportTip.create({
                        data:{
                            value
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