import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()


export default{
    Mutation:{
        evaluateReport: async(_, args:any,{request}):Promise<boolean|null> =>{
            try{
                
                const {
                    rId,
                    bountyAmount,
                    grantedCredit,
                    vulLevel,
                    cvssScore,
                    writingScore,
                    evaluationText,
                } = args;
                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                // progressStatus is thread of status(stack style)
                await prisma.report.update({
                    data:{
                        bountyAmount,
                        grantedCredit,
                        vulLevel,
                        cvssScore,
                        writingScore,
                        evaluationText,
                    },
                    where:{
                        id:rId
                    }
                });

                if(grantedCredit!==null && grantedCredit!==undefined){
                    const reportObj = await prisma.report.findOne({
                        where:{
                            id:rId
                        },
                        select:{
                            author:{
                                select:{
                                    id:true,
                                    hackerInfo:{
                                        select:{
                                            credit:true
                                        }
                                    }
                                }
                            }
                        }
                    });
                    const authorId = reportObj?.author.id;
                    const userCredit = reportObj?.author.hackerInfo?.credit;
                    // get user's credit 

                    await prisma.hackerInfo.update({
                        data:{
                            credit:userCredit+grantedCredit
                        },
                        where:{
                            userId:authorId
                        }

                    })

                }

                return true;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}