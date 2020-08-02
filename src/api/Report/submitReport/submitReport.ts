import { isAuthenticated } from "../../../middleware";
import { PrismaClient, BugBountyProgram, Report } from "@prisma/client";

const prisma = new PrismaClient()


export default{
    Mutation:{
        submitReport: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                // check if user is login
                
                const isAuth:boolean = isAuthenticated(request);
                if(isAuth===false){
                    // non login user is forbidden to access
                    return null
                }

                
                const { user:{id:uId} } = request;
                
                
                console.log(uId)////

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

                    const isUserInPrivateProgram:boolean = ( await prisma.privateProgramConnUser.count({
                        where:{
                            bugBountyProgram:{
                                id:bbpId
                            },
                            permittedUser:{
                                id:uId
                            }

                        }
                    }) >= 1)
                    if(isUserInPrivateProgram===false){
                        return null
                    }


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

                //// if target is not 'others'
                if(targetId !== -1){

                    
                    // check if target id is not for this program
                    const isTargetInProgram:boolean = (await prisma.inScopeTarget.count({
                        where:{
                            id:targetId,
                            bugBountyProgram:{id:bbpId},
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
                 //// if target is not 'others', add target
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

                const {collaboratorInfoList} = args;
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
                
                return rId;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}