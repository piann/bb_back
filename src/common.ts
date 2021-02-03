import { PrismaClient, BugBountyProgram, Role, User, BusinessInfo } from "@prisma/client";
import { isAuthenticated } from "./middleware";


const prisma = new PrismaClient()

export const checkUserHasPermissionInBBP = async (request:any, bbpId:string):Promise<boolean|null> => {
    try{
        // null return means error

        if(bbpId===null||bbpId===undefined){
            return null;
        }
        const bugBountyProgramObj:BugBountyProgram|null = await prisma.bugBountyProgram.findOne({
            where:{
                id:bbpId
            }
        });

        if(bugBountyProgramObj===null){
            return null;
        }
        const isPrivate = bugBountyProgramObj.isPrivate;
        const bbpCompanyId = bugBountyProgramObj.ownerCompanyId;
        const requiredTrustLevel = bugBountyProgramObj.requiredTrustLevel;
        if(isPrivate===false){

                let userTrustLevel:number = 0;
                const isAuth:boolean = isAuthenticated(request);
                if(isAuth===true){
                    const { 
                        user:{
                            id,
                            role
                        }
                    } = request;

                    if(role===Role.ADMIN){
                        return true;
                    } else if(role===Role.BUSINESS){
                        const businessInfoObj = await prisma.businessInfo.findOne({
                            where:{
                                userId:id
                            }
                        });
                        if(businessInfoObj!==null){
                            if(businessInfoObj.companyId===bbpCompanyId){
                                return true;
                            } else {
                                return false;
                            }

                        }else{
                            // business account but no company belonged? error.
                            return false;
                        }

                    } else if(role===Role.HACKER){
                        const hackerInfoObj = await prisma.hackerInfo.findOne({
                            where:{
                                userId:id
                            }
                        })

                        if(hackerInfoObj!==null){
                            userTrustLevel = hackerInfoObj.trustLevel;
                        }
                    }

                }
                
                if(userTrustLevel >= requiredTrustLevel){
                    return true;
                } else {
                    return false;
                }

        }else{
            /* if program is private, 
                HACKER : check if user is in permitted-user-list
                BUSINERR : check if user's company is bbp owner
            */
            if(isAuthenticated(request)===false){
                console.log("should login first");
                return false;
            }
            const { user:{id:uId} } = request;
            const user:User|null = await prisma.user.findOne({
                where:{id:uId}
            });
            const role = user?.role;
    
            if(role === Role.ADMIN){
                return true;
            }else if(role===Role.HACKER){
               
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
                    return false;
                }else{
                    return true;
                }

           } else if (role===Role.BUSINESS){
                const businessInfoObj:BusinessInfo|null = await prisma.businessInfo.findOne({
                    where:{
                        userId:uId
                    }
                })

                if(bbpCompanyId !== businessInfoObj?.companyId){
                    console.log("other company program. access denied");
                    return false;
                } else {
                    return true;
                }
           }

        }
        return false;

    }catch(err){
        console.log(err);
        return null;
    }
}



export const checkUserHasPermissionReport = async (request:any, rId:string):Promise<boolean|null> => {
    try{
        // null return means error

        if(rId===null||rId===undefined){
            return null;
        }

        if(isAuthenticated(request)===false){
            console.log("should login first");
            return false;
        }
        const {
            user:{
                id:uId,
                role
            }
        } = request;


        const reportObj = await prisma.report.findOne({
            where:{
                id:rId
            },
            select:{
                authorId:true,
                bugBountyProgram:{
                    select:{
                        ownerCompanyId:true
                    }
                }
                
            }
        });

        if(reportObj===null){
            return null;
        }

        if(role===Role.ADMIN){
            return true;
        }else if(role===Role.HACKER){
            // compare userId with report author id
            const authorId =reportObj.authorId;
            if(authorId===uId){
                return true;
              
            } else {
                // if not author, find in collaboratorList
                const collaboratorObjList = await prisma.collaboratorInfo.findMany({
                    where:{
                        report:{
                            id:rId
                        }
                    },
                    select:{
                        user:{
                            select:{
                                id:true
                            }
                        }
                    }
                });
                let collaboUserIdList = [] as any;
                for (const collaboObj of collaboratorObjList){
                    collaboUserIdList.push(collaboObj.user.id);
                }
                const isCollaborator = collaboUserIdList.includes(uId);
                if(isCollaborator===true){
                    return false;
                } else {
                    return false;
                }

            }

        } else if (role===Role.BUSINESS){
            // compare user company with report owning company
            const reportOwnerCompanyId = reportObj.bugBountyProgram.ownerCompanyId;

            const bInfoObj = await prisma.businessInfo.findOne({
                where:{
                    userId:uId
                },
                select:{
                    companyId:true
                }
            })
            const userCompanyId = bInfoObj?.companyId

            if (reportOwnerCompanyId===userCompanyId){
                return true;
            } else{
                return false;
            }
        }//// else if (role===Role.BLABLABLA){} for added role


        return false;

    }catch(err){
        console.log(err);
        return null;
    }
}


export const getBBPIdByNameId = async (
    nameId
) => {
    if(nameId===undefined){
        return null;
    }
    try{

        const bbpList = await prisma.bugBountyProgram.findMany({
            where:{
                ownerCompany:{
                    nameId
                }
            }
        });
        
        if(bbpList.length===0){
            return null;
        }

        return bbpList[0].id;
    }catch(err){
        console.log(err);
        return null;
    }
}