import { PrismaClient, Role} from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerReportTipsToProgram: async(_, args:any,{request}):Promise<boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }
                

                const {bId, rIdList} = args;
                for(const rId of rIdList){
                    await prisma.reportTipConnBugBountyProgram.create({
                        data:{
                            reportTip:{
                                connect:{id:rId}
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