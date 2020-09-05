import { PrismaClient } from "@prisma/client";
import { checkUserHasPermissionReport } from "../../../common";

const prisma = new PrismaClient()


interface getReportContentResponse{
fileId:String|null
nameId:String
authorNickName:String
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

                const reportObj:any= await prisma.report.findOne({
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
                        dump:true,
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
                                nickName:true
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
                    cvssScore,
                    target,
                    bugBountyProgram,
                    author,
                    additionalText
                } = reportObj;


                const {
                    name:vulName
                } = vulnerability;

                const {
                    nickName:authorNickName
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
                }

                return res;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}