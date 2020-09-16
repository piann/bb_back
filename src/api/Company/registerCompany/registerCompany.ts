import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";


const prisma = new PrismaClient()

export default{
    Mutation:{
        registerCompany: async(_, args:any,{request}):Promise<boolean> =>{
            // register company by admin

            //// add argument file
            try{
                //// add routine for check root
                if(isAuthenticated(request)===false){
                    return false;
                }


                const {
                    companyName,
                    nameId,
                    webPageUrl
                } = args;

                const isCompanyExisting:boolean = ((await prisma.company.count({
                    where:{
                        companyName
                    }
                })) >= 1)
                if(isCompanyExisting===true){
                    // if companyName already exist, finish routine
                    return false;
                }
                const isNameIdExisting:boolean = ((await prisma.company.count({
                    where:{
                        nameId
                    }
                })) >= 1)
                if(isNameIdExisting===true){
                    // if companyName already exist, finish routine
                    return false;
                }

                await prisma.company.create({
                    data:{
                        companyName,
                        nameId,
                        webPageUrl,
                        logo:null
                    },
                    
                });


                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}