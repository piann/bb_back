import { PrismaClient, Role } from "@prisma/client";
import util from "util";
import { isAuthenticated } from "../../../middleware";
const prisma = new PrismaClient()

export default{
    Mutation:{
        modifyBugBountyProgram: async(_, args:any,{request}):Promise<Boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    console.log("should login first");
                    return false;
                }
                const {
                    user:{
                        role,
                    }
                } = request;
                if( role!==Role.ADMIN){
                    console.log("forbidden access")
                    return false;
                }
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
                    mediumPriceMax,
                    highPriceMin,
                    highriceMax,
                    fatalPriceMin,
                    fatalPriceMax,
                    introduction,
                    managedBy,
                    requiredTrustLevel,
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
                        mediumPriceMax,
                        highPriceMin,
                        highriceMax,
                        fatalPriceMin,
                        fatalPriceMax,
                        introduction,
                        managedBy,
                        requiredTrustLevel,
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