import { checkUserHasPermissionInBBP, getBBPIdByNameId } from "../../../common";
import { PrismaClient, BugBountyProgram, ProgramRule, InScopeTarget } from "@prisma/client";

const prisma = new PrismaClient()

interface scopeTargetResponse{
    type:String;
    value:String;
}

interface getProgramBodyContentsResponse{
    introduction:String;
    disclosurePolicy:String|null;
    ruleValueList:[String];
    openDate:Date|null;
    closeDate:Date|null;
    lowPriceMin:Number;
    lowPriceMax:Number;
    mediumPriceMin:Number;
    mediumPriceMax:Number;
    highPriceMin:Number;
    highriceMax:Number;
    fatalPriceMin:Number;
    fatalPriceMax:Number;
    inScopeTargetList:[scopeTargetResponse];
    outOfScopeTargetList:[scopeTargetResponse]|null;
    exclusionValueList:[String]|null;
}


export default{
    Query:{
        getProgramBodyContents: async(_, args:any,{request }):Promise<getProgramBodyContentsResponse|null> => {
            try{

                let { nameId, bbpId } = args;
                
                if(bbpId==undefined && nameId!==undefined){
                    bbpId = await getBBPIdByNameId(nameId);
                }
                if(await checkUserHasPermissionInBBP(request,bbpId)!==true){
                    return null;
                }

                const bugBountyProgramObj:BugBountyProgram|null = await prisma.bugBountyProgram.findUnique({
                    where:{
                        id:bbpId
                    }
                });
                if(bugBountyProgramObj===null){
                    return null;
                }


                // for getting time info
                const {
                    openDate,
                    closeDate,
                 } = bugBountyProgramObj;

                //// add routine for checking open date and close data  

                // main logic

                

                // for basic text
                const {
                    disclosurePolicy,
                    introduction
                 } = bugBountyProgramObj;

                // for ruleValueList
                const ruleConnObjList = await prisma.programRuleConnBugBountyProgram.findMany({
                    where:{
                        bugBountyProgram:{
                            id:bbpId
                        }
                    }
                });
                let ruleValueList = [] as any;
                for (const ruleConnObj of ruleConnObjList){
                    const pId:number = ruleConnObj.pId; 
                    const ruleObj:ProgramRule|null = await prisma.programRule.findUnique({
                        where:{id:pId}
                    })
                    if(ruleObj!==null){
                        ruleValueList.push(ruleObj.value);
                    }
                }

                // for reward price range
                const {
                    lowPriceMin,
                    lowPriceMax,
                    mediumPriceMin,
                    mediumPriceMax,
                    highPriceMin,
                    highriceMax,
                    fatalPriceMin,
                    fatalPriceMax,
                } = bugBountyProgramObj;

                // for scope

                // inScopeList
                const inScopeTargetFullObjList:InScopeTarget[] = await prisma.inScopeTarget.findMany({
                    where:{
                        bugBountyProgram:{
                            id:bbpId
                        }
                        
                    }
                })

                let inScopeTargetList=[] as any;
                for (const inScopeTargetFullObj of inScopeTargetFullObjList){
                    const infoDict = {type:"",value:""};
                    infoDict.type = inScopeTargetFullObj.type;
                    infoDict.value = inScopeTargetFullObj.value;
                    inScopeTargetList.push(infoDict);
                }
                // outOfScopeList
                const outOfScopeTargetFullObjList:InScopeTarget[] = await prisma.outOfScopeTarget.findMany({
                    where:{
                            bugBountyProgram:{
                                id:bbpId
                        }
                    }
                })

                let outOfScopeTargetList=[] as any;
                for (const outOfScopeTargetFullObj of outOfScopeTargetFullObjList){
                    const infoDict = {type:"",value:""};
                    infoDict.type = outOfScopeTargetFullObj.type;
                    infoDict.value = outOfScopeTargetFullObj.value;
                    outOfScopeTargetList.push(infoDict);
                }

                // for exclusion
                const exclusionConnObjList = await prisma.bountyExclusionConnBugBountyProgram.findMany({
                    where:{
                        bugBountyProgram:{
                            id:bbpId
                        }
                    }
                });
                let exclusionValueList = [] as any;
                for (const exclusionConnObj of exclusionConnObjList){
                    const eId:number = exclusionConnObj.eId; 
                    const exclusionObj:ProgramRule|null = await prisma.bountyExclusion.findUnique({
                        where:{id:eId}
                    })
                    if(exclusionObj!==null){
                        exclusionValueList.push(exclusionObj.value);
                    }
                }

                return {
                    disclosurePolicy,
                    introduction,
                    ruleValueList,
                    openDate,
                    closeDate,
                    lowPriceMin,
                    lowPriceMax,
                    mediumPriceMin,
                    mediumPriceMax,
                    highPriceMin,
                    highriceMax,
                    fatalPriceMin,
                    fatalPriceMax,
                    inScopeTargetList,
                    outOfScopeTargetList,
                    exclusionValueList
                };
            }catch(err){
                console.log(err);
                return null;
            }


        }
    }
}