import { PrismaClient, BugBountyProgram } from "@prisma/client";
import { checkUserHasPermissionInBBP, getBBPIdByNameId } from "../../../common";
const prisma = new PrismaClient()

interface getProgramBannerResponse{
    isPrivate:Boolean;
    companyName:String;
    description:String|null
    webPageUrl:String|null
    submittedReportCount:Number;
    bountyMin:Number;
    bountyMax:Number;
    logoUrl:String|null;
    managedBy:String|null;
}

export default{
    Query:{
        getProgramBanner: async(_, args:any,{request}):Promise<getProgramBannerResponse|null> => {
            try{
                // check permission
                let { nameId, bbpId } = args;
                
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
                })
                if(bugBountyProgramObj===null){
                    return null;
                }
                const isPrivate = bugBountyProgramObj.isPrivate;
                const managedBy = bugBountyProgramObj.managedBy;
                
                // main logic
                const cId = bugBountyProgramObj.ownerCompanyId
                const companyObj = await prisma.company.findOne({
                    where:{id:cId}
                });
                if(companyObj===null){
                    return null
                }
                const {
                    companyName,
                    description,
                    webPageUrl,
                } = companyObj;

                const submittedReportCount = await prisma.report.count({
                    where:{bugBountyProgram:{id:bbpId}}
                })

                const {
                    lowPriceMin:bountyMin,
                    fatalPriceMax:bountyMax
                } = bugBountyProgramObj

                //// add logic for getting logoUrl
                const logoUrl = "file.server.name/f/{logoid}" //// temp logic

            return {
                isPrivate,
                companyName,
                description,
                webPageUrl,
                submittedReportCount,
                bountyMin,
                bountyMax,
                logoUrl,
                managedBy,
            }

            }catch(err){
                console.log(err);
                return null;
            }


        }
    }
}