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
                        isPrivate:{
                            set:isPrivate
                        },
                        disclosurePolicy:{
                            set:disclosurePolicy
                        },
                        openDate:{
                            set:openDate
                        },
                        closeDate:{
                            set:closeDate
                        },
                        isOpen:{
                            set:isOpen
                        },
                        lowPriceMin:{
                            set:lowPriceMin
                        },
                        lowPriceMax:{
                            set:lowPriceMax
                        },
                        mediumPriceMin:{
                            set:mediumPriceMin
                        },
                        mediumriceMax:{
                            set:mediumriceMax
                        },
                        highPriceMin:{
                            set:highPriceMin
                        },
                        highriceMax:{
                            set:highriceMax
                        },
                        fatalPriceMin:{
                            set:fatalPriceMin
                        },
                        fatalPriceMax:{
                            set:fatalPriceMax
                        },
                        introduction:{
                            set:introduction
                        },
                        managedBy:{
                            set:managedBy
                        },
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