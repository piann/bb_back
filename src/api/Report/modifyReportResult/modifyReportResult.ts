import { PrismaClient, Role, ResultCode } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()


export default{
    Mutation:{
        modifyReportResult: async(_, args:any,{request}):Promise<boolean|null> =>{
            try{
                
                const {
                    rId,
                    resultCode,
                } = args;
                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{role}} = request;

                // only admin can modify progress
                if(role!==Role.ADMIN){
                    return false;
                }

                if((resultCode in ResultCode)===false){
                    console.log("Invalid Code");
                    return false;
                }


                // progressStatus is thread of status(stack style)
                await prisma.reportResult.create({
                    data:{
                        report:{
                            connect:{id:rId}
                        },
                        resultCode
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