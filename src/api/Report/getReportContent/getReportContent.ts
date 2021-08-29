import { PrismaClient } from "@prisma/client";
import { checkUserHasPermissionReport } from "../../../common";

const prisma = new PrismaClient()


interface getReportContentResponse{
fileId:String|null
nameId:String
profilePicId:String|null
authorNickName:String
createdAt:Date|null;
vulName:String|null
assetName:String|null
title:String|null
description:String|null
cvssScore:Number|null
additionalText:String|null
location:String|null
enviroment:String|null
dump:String|null
}

export default{
    Query:{
        getReportContent: async(_, args:any,{request }):Promise<getReportContentResponse|null> =>{
            try{
                const {rId} = args;
                if(await checkUserHasPermissionReport(request, rId)!==true){
                    return null;
                }

                const reportObj:any= await prisma.report.findUnique({
                    where:{id:rId},
                    select:{
                        fileId:true,
                        vulnerability:{
                            select:{
                                name:true
                            }
                        },
                        title:true,
                        location:true,
                        enviroment:true,
                        description:true,
                        additionalText:true,
                        dump:true,
                        createdAt:true,
                        cvssScore:true,
                        target:{
                            select:{
                                value:true,
                            }
                        },
                        bugBountyProgram:{
                            select:{
                                ownerCompany:{
                                    select:{
                                        nameId:true
                                    }
                                }
                            }
                        },
                        author:{
                            select:{
                                nickName:true,
                                picId:true,
                            }
                        }
                    }
                });

                if(reportObj===null){
                    return null;
                }


                // main routine

                const {
                    fileId,
                    vulnerability,
                    title,
                    location,
                    enviroment,
                    description,
                    dump,
                    createdAt,
                    cvssScore,
                    target,
                    bugBountyProgram,
                    author,
                    additionalText
                } = reportObj;


                const {
                    name:vulName,
                } = vulnerability;

                const {
                    nickName:authorNickName,
                    picId:profilePicId
                } = author;

                const {
                    ownerCompany:{
                        nameId
                    }
                } = bugBountyProgram;

                console.log(target);////
                let assetName;
                if(target.length===0){
                    assetName = null;
                } else {
                    assetName = target[0].value;
                }


                const res = {
                    fileId,
                    profilePicId,
                    nameId,
                    authorNickName,
                    vulName,
                    assetName,
                    title,
                    description,
                    cvssScore,
                    additionalText,
                    location,
                    enviroment,
                    dump,
                    createdAt,
                }

                return res;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}