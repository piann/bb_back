import { checkUserHasPermissionInBBP, getBBPIdByNameId } from "../../../common";
import { PrismaClient, BugBountyProgram, Vulnerability, ReportTip, InScopeTarget } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()


interface scopeTargetResponse{
    id:number;
    type:String;
    value:String;
}

interface getReportReadyPageResponse{
    reportTipList:String[];
    disclosurePolicy:String|null;
    openDate:Date|null;
    closeDate:Date|null;
    vulnerabilityList:Vulnerability[];
    inScopeTargetList:scopeTargetResponse[];
}

export default{
    Query:{
        getReportReadyPage: async(_, args:any,{request }):Promise<getReportReadyPageResponse|null> => {
            try{
       
                let { nameId, bbpId } = args;
                
                if(isAuthenticated(request)===false){
                    return null;
                    // only login user can submit report
                }

                if(bbpId==undefined && nameId!==undefined){
                    bbpId = await getBBPIdByNameId(nameId);
                }

                if(await checkUserHasPermissionInBBP(request,bbpId)!==true){
                    return null;
                }

                const bugBountyProgramObj:BugBountyProgram|null = await prisma.bugBountyProgram.findOne({
                    where:{
                        id:bbpId
                    }
                });
                if(bugBountyProgramObj===null){
                    return null
                }


                // for getting time info
                const {
                    openDate,
                    closeDate,
                    } = bugBountyProgramObj;

                //// add routine for checking open date and close data  

                // main logic
                
                // for basic text
                const {
                    disclosurePolicy,
                } = bugBountyProgramObj;
                
                // for reportTipList
                const reportTipConnObjList = await prisma.reportTipConnBugBountyProgram.findMany({
                    where:{
                        bugBountyProgram:{
                            id:bbpId
                        }
                    }
                });

                let reportTipList = [] as any;
                for (const reportTipConnObj of reportTipConnObjList){
                    const rId:number = reportTipConnObj.rId; 
                    const reportTipObj:ReportTip|null = await prisma.reportTip.findOne({
                        where:{id:rId}
                    })
                    if(reportTipObj!==null){
                        reportTipList.push(reportTipObj.value);
                    }
                }


                const vulnerabilityList = await prisma.vulnerability.findMany({});
                
                // inScopeList
                const inScopeTargetFullObjList:InScopeTarget[] = await prisma.inScopeTarget.findMany({
                    where:{
                        bugBountyProgram:{
                            id:bbpId
                        }
                    }
                })

                let inScopeTargetList=[] as any;
                for (const inScopeTargetFullObj of inScopeTargetFullObjList){
                    const infoDict = {id:-1,type:"",value:""};
                    infoDict.id = inScopeTargetFullObj.id;
                    infoDict.type = inScopeTargetFullObj.type;
                    infoDict.value = inScopeTargetFullObj.value;
                    inScopeTargetList.push(infoDict);
                }


                
                return {
                    reportTipList,
                    disclosurePolicy,
                    openDate,
                    closeDate,
                    vulnerabilityList,
                    inScopeTargetList,
                }

            }catch(err){
                console.log(err);
                return null;
            }


        }
    }
}