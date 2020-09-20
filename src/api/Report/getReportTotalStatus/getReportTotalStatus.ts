import { PrismaClient,  ResultCode, Report } from "@prisma/client";
import { checkUserHasPermissionReport } from "../../../common";

const prisma = new PrismaClient()


interface commentInfo{
    id:String;
    content:String;
    writerNickName:String;
    profilePicId:String|null|undefined;
    fileId:String|null;
}

interface getReportTotalStatusResponse{
    nameId:String|null|undefined;
    authorNickName:String;
    progressStatus:Number;
    resultCode:String|null;
    bountyAmount:Number|null;
    grantedCredit:Number|null;
    commentInfoList:[commentInfo];
}


export default{
    Query:{
        getReportTotalStatus: async(_, args:any,{request }):Promise<getReportTotalStatusResponse|null> =>{
            try{
                const {rId} = args;
                if(await checkUserHasPermissionReport(request, rId)!==true){
                    return null;
                }

                const reportObj:Report|null = await prisma.report.findOne({
                    where:{
                        id:rId
                    }
                });

                if(reportObj===null){
                    return null;
                }


                // main routine

                const bbpId = reportObj.bbpId;
                const bbpObj = await prisma.bugBountyProgram.findOne({
                    where:{id:bbpId},
                    select:{
                        ownerCompany:{
                            select:{
                                nameId:true
                            }
                        }
                    }
                });

                const nameId = bbpObj?.ownerCompany.nameId

                const {
                    bountyAmount,
                    grantedCredit,
                 } = reportObj;

                
                const authorObj = await prisma.user.findOne({
                    where:{id:reportObj.authorId}
                });
                let authorNickName:string = "";
                if(authorObj!==null){
                    authorNickName = authorObj.nickName
                }

                // get recent status
                const progressStatusObjList = await prisma.progressStatus.findMany({
                    where:{
                        report:{
                            is:{id:rId}
                        },
                    },
                    orderBy:{createdAt:'desc'}
                });
                
                const progressStatus = progressStatusObjList[0].progressIdx

                // get recent result
                const reportResultObjList = await prisma.reportResult.findMany({
                    where:{
                        report:{
                            is:{id:rId}
                        },
                    },
                    orderBy:{createdAt:'desc'}
                });
                console.log(reportResultObjList);////
                let resultCode:ResultCode|null = null;
                if (reportResultObjList.length!==0){
                    resultCode = reportResultObjList[0].resultCode;
                    
                }

                // get commentInfoList
                const commentInfoList = [] as any;
                const commentObjList = await prisma.reportComment.findMany({
                    where:{report:{
                        is:{id:rId}
                    }},
                    select:{
                        id:true,
                        content:true,
                        fileId:true,
                        writer:{
                            select:{
                                nickName:true,
                                picId:true
                            }
                        }
                    }
                });

                for (const commentObj of commentObjList){
                    const commentInfo:commentInfo = {
                        id:commentObj.id,
                        content:commentObj.content,
                        fileId:commentObj.fileId,
                        profilePicId:commentObj.writer.picId,
                        writerNickName:commentObj.writer.nickName,
                    }
                    commentInfoList.push(commentInfo);

                }

                const res = {
                    nameId,
                    authorNickName,
                    progressStatus,
                    resultCode,
                    bountyAmount,
                    grantedCredit,
                    commentInfoList
                }
                return res;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}