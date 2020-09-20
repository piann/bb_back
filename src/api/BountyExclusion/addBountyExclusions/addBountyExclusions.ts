import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";


const prisma = new PrismaClient()


export default{
    Mutation:{
        addBountyExclusions: async(_, args:any,{request}):Promise<boolean> =>{
            try{

                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }


                const {
                    valueList,
                } = args;

                for(var value of valueList){
                    await prisma.bountyExclusion.create({
                        data:{
                            value,
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