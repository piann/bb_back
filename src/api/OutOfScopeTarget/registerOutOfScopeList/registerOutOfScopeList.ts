import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface registerOutOfScopeListArgs{
    outOfScopeTargetStringList:[string];
    bbpId:string;
}

export default{
    Mutation:{
        registerOutOfScopeList: async(_, args:registerOutOfScopeListArgs,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                // note that outOfScopeTarget format is "TYPE>address"
                const {
                    outOfScopeTargetStringList,
                    bbpId
                } = args;

                for(var targetInfo of outOfScopeTargetStringList){
                    const type:any= targetInfo.slice(0,targetInfo.indexOf(">"));
                    const value:string = targetInfo.slice(targetInfo.indexOf(">")+1);
                    await prisma.outOfScopeTarget.create({
                        data:{
                            type,
                            value,
                            bugBountyProgram:{
                                connect:{id:bbpId}
                            }

                        }
                    })
                }


                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}