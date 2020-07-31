import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface registerInScopeListArgs{
    inScopeTargetStringList:[string];
    bbpId:string;
}

export default{
    Mutation:{
        registerInScopeList: async(_, args:registerInScopeListArgs,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                const {
                    inScopeTargetStringList,
                    bbpId
                } = args;

                for(var targetInfo of inScopeTargetStringList){
                    const type:any= targetInfo.slice(0,targetInfo.indexOf(">"));
                    const value:string = targetInfo.slice(targetInfo.indexOf(">")+1);
                    await prisma.inScopeTarget.create({
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