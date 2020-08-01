import { isAuthenticated } from "../../../middleware";
import { PrismaClient, BugBountyProgram } from "@prisma/client";

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
}

export default{
    Query:{
        getProgramBanner: async(_, args:any,{request }):Promise<getProgramBannerResponse|null> => {
            try{

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
                    const isAuth:boolean = isAuthenticated(request);
                    if(isAuth===false){
                        // non login user is forbidden to access
                        return null
                    }
                    const { user:{id} } = request;
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
                }

            }catch(err){
                console.log(err);
                return null;
            }


        }
    }
}