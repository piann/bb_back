import { checkUserHasPermissionInBBP, getBBPIdByNameId } from "../../../common";
import { PrismaClient, Report, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";
import { sendEmail } from "../../../utils";

const prisma = new PrismaClient()


export default{
    Mutation:{
        submitReport: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                
                if(isAuthenticated(request)===false){
                    return null;
                    // only login user can submit report
                }
                let { nameId, bbpId } = args;
                
                if(bbpId==undefined && nameId!==undefined){
                    bbpId = await getBBPIdByNameId(nameId);
                }

                if(await checkUserHasPermissionInBBP(request,bbpId)!==true){
                    return null;
                }
                
                const { 
                    user:{
                        id:uId,
                        role
                    } 
                } = request;
                
                // hacker and admin can report

                if(role!==Role.HACKER && role!==Role.ADMIN){
                    return null;
                }
                
                // main routine

                const {
                    targetId,
                    vId,
                    attackComplexity,
                    requiredPriv,
                    userInteraction,
                    confidentiality,
                    integrity,
                    availablity,
                    title,
                    location,
                    enviroment,
                    description,
                    dump,
                    additionalText,
                } = args;

                // if target is not 'others'
                if(targetId !== -1){

                    
                    // check if target id is not for this program
                    const isTargetInProgram:boolean = (await prisma.inScopeTarget.count({
                        where:{
                            id:targetId,
                            bugBountyProgram:{
                                id:bbpId
                            },
                        }
                    }) >= 1 )
                    if(isTargetInProgram===false){
                        return null;
                    }
                }

                
                const reportObj:Report = await prisma.report.create({
                    data:{
                        author:{connect:{id:uId}},
                        vulnerability:{connect:{id:vId}},
                        attackComplexity,
                        requiredPriv,
                        userInteraction,
                        confidentiality,
                        integrity,
                        availablity,
                        title,
                        location,
                        enviroment,
                        description,
                        dump,
                        additionalText,
                        bugBountyProgram:{connect:{id:bbpId}},
                        
                    }
                });


                const rId = reportObj.id
                 // if target is not 'others', add target
                if(targetId !== -1){
                    await prisma.report.update({
                        data:{
                            target:{connect:{id:targetId}}
                        },
                        where:{
                            id:rId
                        }
                    })
                }

                // create collaborator information
                //// add check logic if user is HACKER
                //// add check logic if user is duplicated
                ///// add check length of collabo list

                const {collaboratorInfoList} = args;
                if(collaboratorInfoList!==undefined){

                    for (const collaboratorInfo of collaboratorInfoList){
                        const uId = collaboratorInfo.userId;
                        const cRatio = collaboratorInfo.contributionRatio;
                        await prisma.collaboratorInfo.create({
                            data:{
                                user:{connect:{id:uId}},
                                contributionRatio:cRatio,
                                report:{connect:{id:rId}}
                            }
                        })
                    }
                }
    
                // create progressStatus
                // 0 : stand by 1: in progress 2: in discussion 3: resolved
                await prisma.progressStatus.create({
                    data:{
                        report:{connect:{id:rId}},
                    }
                });

                await sendEmail({
                    fromInfo:"zerowhale team <no-reply>",
                    toEmail:"support@pastelplanet.space",
                    title:"[notification] 리포트가 제출되었습니다.",
                    content:"https://zerowhale.io/report_thread/"+rId,
                });

                return rId;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}