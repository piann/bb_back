import { PrismaClient } from "@prisma/client";
import util from "util";
const prisma = new PrismaClient()

export default{
    Mutation:{
        modifyBugBountyProgram: async(_, args:any,{request}):Promise<Boolean> =>{
            try{
                //// add routine for check root

                const {
                    bbpId,
                    isPrivate,
                    disclosurePolicy,
                    isOpen,
                    openDateYear,
                    openDateMonth,
                    openDateDay,
                    closeDateYear,
                    closeDateMonth,
                    closeDateDay,
                    lowPriceMin,
                    lowPriceMax,
                    mediumPriceMin,
                    mediumriceMax,
                    highPriceMin,
                    highriceMax,
                    fatalPriceMin,
                    fatalPriceMax,
                    introduction,
                    managedBy,
                } = args;

                let openDate:Date|undefined;
                let closeDate:Date|undefined;
                if(openDateYear!==undefined&&openDateMonth!==undefined&&openDateDay!==undefined){
                    openDate = new Date(util.format("%d/%d/%d 00:00:0:1",openDateMonth,openDateDay,openDateYear))
                }
 
                if(closeDateYear!==undefined&&closeDateMonth!==undefined&&closeDateDay!==undefined){
                    closeDate = new Date(util.format("%d/%d/%d 00:00:0:1",closeDateMonth,closeDateDay,closeDateYear))
                }

                await prisma.bugBountyProgram.update({
                    data:{
                        isPrivate,
                        disclosurePolicy,
                        openDate,
                        closeDate,
                        isOpen,
                        lowPriceMin,
                        lowPriceMax,
                        mediumPriceMin,
                        mediumriceMax,
                        highPriceMin,
                        highriceMax,
                        fatalPriceMin,
                        fatalPriceMax,
                        introduction,
                        managedBy,
                    },
                    where:{
                        id:bbpId
                    }
                })

                return true
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}