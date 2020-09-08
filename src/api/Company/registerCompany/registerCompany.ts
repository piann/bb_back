import { PrismaClient, FileObj } from "@prisma/client";
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
                    user:{
                        id:uId,
                    }
                } = request;

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

                //// add logic for upload logo and return logoId
                const fileObj:FileObj = await prisma.fileObj.create({
                    data:{
                        isPublic:true,
                        fileName:"pastelLogo.png",
                        fileType:"png",
                        uploadUser:{
                            connect:{id:uId}
                        }
                    }
                })
                const logoId = fileObj.id;

                await prisma.company.create({
                    data:{
                        companyName,
                        nameId,
                        webPageUrl,
                        logo:{
                            connect:{id:logoId}
                        }
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