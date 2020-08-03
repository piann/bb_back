import { PrismaClient,  ResultCode, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()


interface reportInfo{
    reportId:String;
    status:String;
    result:String|null;
    companyName:String|null;
}

interface getMyPageResponse{
    email:String;
    nickName:String;
    profilePictureId:String|null;
    reportInfoList:[reportInfo]|null;
}


export default{
    Query:{
        getMyPage: async(_, args:any,{request }):Promise<getMyPageResponse|null> =>{
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
                    console.log("Only Hacker has 'my page'");
                    return null;
                }

                // get information of reports
                const submittedReportList = await prisma.report.findMany({
                    where:{
                        authorId:uId
                    }
                });

                let reportInfoList = [] as any;
                for (const submittedReport of submittedReportList){
                    const reportId = submittedReport.id;
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
                            report:{id:submittedReport.id},
                        },
                        orderBy:{createdAt:'desc'}
                    });
                    
                    const status = progressStatusObjList[0].progressIdx

                    // get recent result
                    const reportResultObjList = await prisma.reportResult.findMany({
                        where:{
                            report:{id:submittedReport.id},
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
                    });

                }

                const res = {
                    email,
                    nickName,
                    profilePictureId:picId,
                    reportInfoList
                }

                return res;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}