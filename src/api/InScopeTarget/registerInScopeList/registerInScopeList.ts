import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

interface registerInScopeListArgs{
    inScopeTargetStringList:[string];
    bbpId:string;
}

export default{
    Mutation:{
        registerInScopeList: async(_, args:registerInScopeListArgs,{request}):Promise<boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                // note that inScopeTarget format is "TYPE>address"
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