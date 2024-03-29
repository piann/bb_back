import { PrismaClient, BugBountyProgram } from "@prisma/client";
import { checkUserHasPermissionInBBP } from "../../../common";

const prisma = new PrismaClient()

interface programInfoForPublic{
    logoId:String|null;
    companyName:String;
    nameId:String;
    description:String|null;
    inScopeTypeList:[String];
    bountyMin:Number;
    bountyMax:Number;
    managedBy:String|null;
}

export default{
    Query:{
        getProgramList: async(_, args:any,{request}):Promise<programInfoForPublic|null> => {
            try{
                
                // if user trust level is lower than required trust level, push null to result list
                const bugBountyProgramObjList:BugBountyProgram[] = await prisma.bugBountyProgram.findMany({
                    where:{
                        isOpen:true,
                        isPrivate:false,
                    }
                })

                let resultList = [] as any;
                for (const bugBountyProgramObj of bugBountyProgramObjList){

                    //const requiredTrustLevel = bugBountyProgramObj.requiredTrustLevel;

                    const isPermitted = await checkUserHasPermissionInBBP(request, bugBountyProgramObj.id);

                    if(isPermitted!==true){

                        resultList.push(null);

                    } else {
                        const bbpId = bugBountyProgramObj.id;

                        let programInfo = {
                            logoId:undefined,
                            companyName:undefined,
                            nameId:undefined,
                            description:undefined,
                            inScopeTypeList:undefined,
                            bountyMin:undefined,
                            bountyMax:undefined,
                            managedBy:undefined,
                        } as any;
                        const cId = bugBountyProgramObj.ownerCompanyId;
                        const companyObj = await prisma.company.findUnique({
                            where:{id:cId}
                        });
    
                        programInfo.logoId = companyObj?.logoId || null;
                        programInfo.companyName = companyObj?.companyName || null;
                        programInfo.nameId = companyObj?.nameId || null ;
                        programInfo.description = companyObj?.description || null;
    
                        const inScopeTargetList = await prisma.inScopeTarget.findMany({
                            where:{
                                bugBountyProgram:{
                                        id:bbpId
                                }
                            }, 
                            select:{
                                type:true,
                            }
                        });
                        
                        let typeList = [] as any;
                        for(const inScopeTarget of inScopeTargetList){
                            typeList.push(inScopeTarget.type);
                        }
                        programInfo.inScopeTypeList = Array.from(new Set(typeList));
    
                        programInfo.bountyMin = bugBountyProgramObj.lowPriceMin;
                        programInfo.bountyMax = bugBountyProgramObj.fatalPriceMax;
                        programInfo.managedBy = bugBountyProgramObj.managedBy;
    
                        resultList.push(programInfo);
                    }
                    
                }
                
                return resultList;


            }catch(err){
                console.log(err);
                return null;
            }


        }
    }
}