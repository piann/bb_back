import { PrismaClient, BugBountyProgram, Role} from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        initBugBountyProgram: async(_, args:any,{request}):Promise<String|null> =>{
            try{
                
                if(isAuthenticated(request)===false){
                    console.log("should login first");
                    return null;
                }
                const {
                    user:{
                        role,
                    }
                } = request;
                if( role!==Role.ADMIN){
                    console.log("forbidden access")
                    return null;
                }

                const {companyName, isPrivate} = args;
                const bugBountyProgram:BugBountyProgram = await prisma.bugBountyProgram.create({
                    data:{
                        ownerCompany:{
                            connect:{companyName}
                        },
                        isPrivate

                    }
                });
                const bbpId = bugBountyProgram.id; 
                return bbpId;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}