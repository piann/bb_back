import { PrismaClient, Role} from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerProgramRulesToProgram: async(_, args:any,{request}):Promise<boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                const {bId, pIdList} = args;
                for(const pId of pIdList){
                    await prisma.programRuleConnBugBountyProgram.create({
                        data:{
                            programRule:{
                                connect:{id:pId}
                            },
                            bugBountyProgram:{
                                connect:{id:bId}
                            }
                        }
                    });
                }
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}