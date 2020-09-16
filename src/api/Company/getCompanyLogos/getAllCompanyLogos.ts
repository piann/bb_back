import { PrismaClient, Role } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

interface companyLogoInfo{
    id:String;
    companyName:String;
    nameId:String;
    logoId:String|null;
}

export default{
    Query:{
        getAllCompanyLogos: async(_, args:any,{request}):Promise<companyLogoInfo[]|null> => {
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

                const companyLogoInfoList = await prisma.company.findMany({
                    select:{
                        id:true,
                        companyName:true,
                        nameId:true,
                        logoId:true
                    }
                });

                
                return companyLogoInfoList;


            }catch(err){
                console.log(err);
                return null;
            }


        }
    }
}