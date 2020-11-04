import { isAuthenticated } from "../../../middleware";
import { PrismaClient, BugBountyProgram, Role, ResultCode } from "@prisma/client";
import { getBBPIdByNameId } from "../../../common";

const prisma = new PrismaClient()

interface reportInfo{
    reportId:String;
    status:String;
    result:String|null;
    authorNickName:String|null;
}


interface getBusinessBountyPageResponse{
    submittedReportCount:Number;
    totalVulnerabilityCount:Number;
    rewardedVulnerabilityCount:Number;
    totalReward:Number;
    joinedHackerCount:Number;
    closeDate:Date|null|undefined;
    openDate:Date|null|undefined;
    firstReportDate:Date|null;
    recentReportDate:Date|null;
    reportInfoList:[reportInfo]
    isInitBugBounty:Boolean|null
}


export default{
    Query:{
        getBusinessBountyPage: async(_, args:any,{request }):Promise<getBusinessBountyPageResponse|null|undefined> => {
            try{

                let { nameId, bbpId } = args;
                let submittedReportCount = 0;
                let totalReward:number = 0;
                let totalVulnerabilityCount:number = 0;
                let rewardedVulnerabilityCount:number = 0;
                let joinedHackerIdList = [] as any;
                let firstReportDate:Date|null=null ;
                let recentReportDate:Date|null=null;
                let reportInfoList = [] as any;
                let joinedHackerCount = 0;
                let isInitBugBounty:boolean|null = null;


                // main logic
                // 1. admin or company in progress Bugbounty -> return getBusinessBountyPageResponse
                // 2. company not in progress Bugbounty -> return getBusinessBountyPageResponse
                // 3. unauthorized account  -> return null


                // prove this account is companyId
                const {
                    user:{
                        id:uId,
                        role,
                        email
                    }
                } = request;
                

                const userObj = await prisma.user.findOne({
                        where:{
                            email
                        }
                });
                
                const userId = userObj?.id;
                
                const businessInfoObj = await prisma.businessInfo.findOne({
                    where:{
                        userId
                    }
                });
                
                const companyId = businessInfoObj?.companyId;       
            


                if(bbpId==undefined && nameId!==undefined){
                    bbpId = await getBBPIdByNameId(nameId);
                }


                // 1. if exist bugbounty program in progress
                if(bbpId !== null){
                    const bugBountyProgramObj:BugBountyProgram|null = await prisma.bugBountyProgram.findOne({
                        where:{
                            id:bbpId
                        }
                    });
    
                    if(bugBountyProgramObj===null){
                        return null;
                    } 
      
                    // for getting time info
                    const {
                        openDate,
                        closeDate,
                    } = bugBountyProgramObj;
                    
                    const isAuth:boolean = isAuthenticated(request);
                    if(isAuth===false){
                        // non login user is forbidden to access
                        return null;
                    }
    
    
                    if(role!==Role.ADMIN){
                        // ADMIN all pass this check routine
    
                        if(role!==Role.BUSINESS){
                            console.log("UnAuthorized access 1");
                            return null;
                    
                        } else {
                            // if Business account, they should be owner company
                            const ownerCompanyId = bugBountyProgramObj.ownerCompanyId
    
                            const isOwner:boolean = (await prisma.businessInfo.count({
                                where:{
                                    user:{
                                        id:uId
                                    },
                                    company:{
                                        id:ownerCompanyId
                                    }
                                }
                            }) >= 1)
                            if (isOwner===false){
                                console.log("UnAuthorized access 2");
                                return null;
                            }
                            
                        }
                    }
                
                    // main logic
                    
                    /* 
                    Want to get totalVulnerabilityCount
                    1. recent ProgressStatus.progressIdx is 3 (0,1,2,3 and 3 is resolved)
                    2. recent ReportResult.resultCode is NOT_TARGET_BOUNTY or TARGET_BOUNTY
                    
                    Want to get rewardedVulnerabilityCount
                    1. recent ProgressStatus.progressIdx is 3 (0,1,2,3 and 3 is resolved)
                    2. recent ReportResult.resultCode is NOT_TARGET_BOUNTY or TARGET_BOUNTY
                    
                    */
                   
                   const submittedReportList = await prisma.report.findMany({
                       where:{
                           bugBountyProgram:{
                               id:bbpId,
                            }
                        },
                        orderBy:{createdAt:'desc'}
                    })
                    
                    submittedReportCount = submittedReportList.length;
                    
                    
                    for (const submittedReport of submittedReportList){
                        totalReward += submittedReport.bountyAmount;
                        
                        joinedHackerIdList.push(submittedReport.authorId);
                        
                        // 1. get Recent ProgressStatus
                        const progressStatusObjList = await prisma.progressStatus.findMany({
                            where:{
                                report:{
                                    id:submittedReport.id
                                }
                            },
                            orderBy:{createdAt:'desc'}
                        });
    
                        const recentPrgressIdx = progressStatusObjList[0].progressIdx
                        if(recentPrgressIdx!=3){
                            continue;
                        }
                        // 2. get Recent ReportResult
                        const reportResultObjList = await prisma.reportResult.findMany({
                            where:{
                                report:{
                                    id:submittedReport.id
                                }
                            },
                            orderBy:{createdAt:'desc'}
                        });
                        if (reportResultObjList.length===0){
                            continue;
                        }
                        
                        const recentResultCode = reportResultObjList[0].resultCode
                        if(recentResultCode===ResultCode.NOT_VULNERABILITY){
                            totalVulnerabilityCount += 1;
                        } else if(recentResultCode===ResultCode.TARGET_BOUNTY){
                            totalVulnerabilityCount += 1;
                            rewardedVulnerabilityCount += 1;
                        }
    
    
    
                    }
    
    
                    if(submittedReportList.length!==0){
                        recentReportDate = submittedReportList[0].createdAt;
                        firstReportDate = submittedReportList[submittedReportList.length - 1].createdAt;
                    }
    
                    for (const submittedReport of submittedReportList){
                        const reportId = submittedReport.id;
                        const authorObj = await prisma.user.findOne({
                            where:{id:submittedReport.authorId}
                        });
                        let authorNickName:string|null = null;
                        if(authorObj!==null){
                            authorNickName = authorObj.nickName
                        }
    
                        // get recent status
                        const progressStatusObjList = await prisma.progressStatus.findMany({
                            where:{
                                report:{
                                    id:submittedReport.id
                                }
                            },
                            orderBy:{createdAt:'desc'}
                        });
                        
                        const status = progressStatusObjList[0].progressIdx
    
                        // get recent result
                        const reportResultObjList = await prisma.reportResult.findMany({
                            where:{
                                report:{
                                    id:submittedReport.id
                                }
                            },
                            orderBy:{createdAt:'desc'}
                        });
                        let resultCode:ResultCode|null = null;
                        if (reportResultObjList.length!==0){
                            resultCode = reportResultObjList[0].resultCode;
                            
                        }
                        
    
                        // make reportInfo and push to list
                        reportInfoList.push({
                            reportId,
                            status,
                            resultCode,
                            authorNickName
                        });
    
                    }
                    const uJoinedHackerIdList = Array.from(new Set(joinedHackerIdList))
                    joinedHackerCount = uJoinedHackerIdList.length;
    
                    return {
                        submittedReportCount,
                        totalVulnerabilityCount,
                        rewardedVulnerabilityCount,
                        totalReward,
                        joinedHackerCount,
                        openDate,
                        closeDate,
                        firstReportDate,
                        recentReportDate,
                        reportInfoList,
                        isInitBugBounty
                   }
                

                }
                // 2. company not in progress Bugbounty
                else if(bbpId === null && companyId !== null){
                    return {
                        submittedReportCount,
                        totalVulnerabilityCount,
                        rewardedVulnerabilityCount,
                        totalReward,
                        joinedHackerCount,
                        openDate:undefined,
                        closeDate:undefined,
                        firstReportDate,
                        recentReportDate,
                        reportInfoList,
                        isInitBugBounty:false
                   }
                }
                

        
            } catch(err){
                console.log(err);
                return null;
            }


        }
    }
}