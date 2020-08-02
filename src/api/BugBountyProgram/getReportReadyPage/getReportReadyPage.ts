import { isAuthenticated } from "../../../middleware";
import { PrismaClient, BugBountyProgram, Vulnerability, ReportTip, InScopeTarget } from "@prisma/client";

const prisma = new PrismaClient()


interface scopeTargetResponse{
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


                // non login user is forbidden to access
                const isAuth:boolean = isAuthenticated(request);
                if(isAuth===false){
                    return null
                }
                const { user:{id} } = request;

                //
                const { bbpId } = args;
                const bugBountyProgramObj:BugBountyProgram|null = await prisma.bugBountyProgram.findOne({
                    where:{
                        id:bbpId
                    }
                });
                if(bugBountyProgramObj===null){
                    return null
                }

                const isPrivate = bugBountyProgramObj.isPrivate;
                

                //  if it is private, check user is permitted
                if(isPrivate===true){

                    const isUserInPrivateProgram:boolean = ( await prisma.privateProgramConnUser.count({
                        where:{
                            bugBountyProgram:{
                                id:bbpId
                            },
                            permittedUser:{
                                id
                            }

                        }
                    }) >= 1)
                    if(isUserInPrivateProgram===false){
                        return null
                    }

                }

                // for getting time info
                const {
                    openDate,
                    closeDate,
                    } = bugBountyProgramObj;

                    console.log(openDate, closeDate);////
                //// add routine for checking open date and close data  

                // main logic
                
                // for basic text
                const {
                    disclosurePolicy,
                } = bugBountyProgramObj;
                
                // for reportTipList
                const reportTipConnObjList = await prisma.reportTipConnBugBountyProgram.findMany({
                    where:{
                        bugBountyProgram:{id:bbpId}
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
                    where:{bugBountyProgram:{id:bbpId}}
                })

                let inScopeTargetList=[] as any;
                for (const inScopeTargetFullObj of inScopeTargetFullObjList){
                    const infoDict = {type:"",value:""};
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