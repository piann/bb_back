import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

interface registerOutOfScopeListArgs{
    outOfScopeTargetStringList:[string];
    bbpId:string;
}

export default{
    Mutation:{
        registerOutOfScopeList: async(_, args:registerOutOfScopeListArgs,{request}):Promise<boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

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