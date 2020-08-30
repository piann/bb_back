import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()


export default{
    Mutation:{
        modifyProgress: async(_, args:any,{request}):Promise<boolean|null> =>{
            try{
                
                const {
                    rId,
                    progressIdx,
                } = args;
                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                // progressStatus is thread of status(stack style)
                await prisma.progressStatus.create({
                    data:{
                        report:{
                            connect:{id:rId}
                        },
                        progressIdx
                    }
                });

                return true;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}