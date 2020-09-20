import { PrismaClient,  ResultCode, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()


interface reportInfo{
    reportId:String;
    status:String;
    result:String|null;
    companyName:String|null;
    vulName:String|null;
    submitDate:Date|null;
}

interface getMyProfileResponse{
    role:String;
    email:String;
    nickName:String;
    profilePictureId:String|null;
    credit?:Number
    numOfVul?:Number
    reportInfoList:[reportInfo]|null;
}


export default{
    Query:{
        getMyProfile: async(_, args:any,{request }):Promise<getMyProfileResponse|null> =>{
            // Login routine
            try{
                
                // non login user is forbidden to access
                const isAuth:boolean = isAuthenticated(request);
                if(isAuth===false){
                    return null
                }

                const { 
                    user:{
                        id:uId,
                        nickName,
                        email,
                        picId,
                        role
                    }
                } = request;

                console.log(role);////
                if(role!==Role.HACKER){
                    return {
                        role,
                        email,
                        nickName,
                        profilePictureId:picId,
                        reportInfoList:null,
                    };
                }

                // get Information Hacker Spec

                const hackerInfoObj = await prisma.hackerInfo.findOne({
                    where:{
                        userId:uId
                    }
                });
                const credit = hackerInfoObj?.credit;

                const numOfVul = await prisma.report.count({
                    where:{
                        authorId:uId,
                        cvssScore:{
                            not:null
                        }
                    }
                })

                // get information of reports
                const submittedReportList = await prisma.report.findMany({
                    where:{
                        authorId:uId
                    }
                });

                let reportInfoList = [] as any;


                for (const submittedReport of submittedReportList){
                    const reportId = submittedReport.id;
                    const submitDate = submittedReport.createdAt;
                    console.log(submittedReport)
                    const vId = submittedReport.vulId;
                    const vulObj = await prisma.vulnerability.findOne({
                        where:{
                            id:vId
                        }
                    })
                    const vulName = vulObj?.name;

                    const relatedBbpId = submittedReport.bbpId;
                    

                    const bbpObj= await prisma.bugBountyProgram.findOne({
                        where:{id:relatedBbpId},
                        select:{
                            ownerCompany:{
                                select:{
                                    companyName:true
                                }
                            }
                        }
                    });
                    const companyName = bbpObj?.ownerCompany.companyName;
                    
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
                        companyName,
                        submitDate,
                        vulName,
                    });

                }

                const res = {
                    role,
                    email,
                    nickName,
                    profilePictureId:picId,
                    reportInfoList,
                    credit,
                    numOfVul
                }

                return res;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}