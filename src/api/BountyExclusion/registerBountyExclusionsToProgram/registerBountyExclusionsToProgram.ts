import { PrismaClient, Role} from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerBountyExclusionToProgram: async(_, args:any,{request}):Promise<boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                const {bId, eIdList} = args;
                for(const eId of eIdList){
                    await prisma.bountyExclusionConnBugBountyProgram.create({
                        data:{
                            bountyExclusion:{
                                connect:{id:eId}
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