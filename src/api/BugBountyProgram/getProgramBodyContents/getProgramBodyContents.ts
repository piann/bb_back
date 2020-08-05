import { checkUserHasPermissionInBBP } from "../../../common";
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
    mediumriceMax:Number;
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

                const { bbpId } = args;

                if(await checkUserHasPermissionInBBP(request,bbpId)!==true){
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


                // for getting time info
                const {
                    openDate,
                    closeDate,
                 } = bugBountyProgramObj;

                 console.log(openDate, closeDate);////
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
                        bugBountyProgram:{id:bbpId}
                    }
                });
                let ruleValueList = [] as any;
                for (const ruleConnObj of ruleConnObjList){
                    const pId:number = ruleConnObj.pId; 
                    const ruleObj:ProgramRule|null = await prisma.programRule.findOne({
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
                    mediumriceMax,
                    highPriceMin,
                    highriceMax,
                    fatalPriceMin,
                    fatalPriceMax,
                } = bugBountyProgramObj;

                // for scope

                // inScopeList
                const inScopeTargetFullObjList:InScopeTarget[] = await prisma.inScopeTarget.findMany({
                    where:{bugBountyProgram:{id:bbpId}}
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
                    where:{bugBountyProgram:{id:bbpId}}
                })

                let outOfScopeTargetList=[] as any;
                for (const outOfScopeTargetFullObj of outOfScopeTargetFullObjList){
                    const infoDict = {type:"",value:""};
                    infoDict.type = outOfScopeTargetFullObj.type;
                    infoDict.value = outOfScopeTargetFullObj.value;
                    outOfScopeTargetList.push(infoDict);
                }

                // for exclusion

                const exclusionObjList = await prisma.bountyExclusion.findMany({
                    where:{bugBountyProgram:{id:bbpId}}
                })

                let exclusionValueList = [] as any;
                for (const exclusionObj of exclusionObjList){
                    const exclusionValue = exclusionObj.value;
                    exclusionValueList.push(exclusionValue);
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
                    mediumriceMax,
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