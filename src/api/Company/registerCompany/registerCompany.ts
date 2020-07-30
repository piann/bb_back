import { PrismaClient, FileObj } from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        registerCompany: async(_, args:any,{request, isAuthenticated}):Promise<boolean> =>{
            // register company by admin

            //// add argument file
            try{
                //// add routine for check root

                const {
                    companyName,
                    webPageUrl
                } = args;
                
                const existAlready:boolean = ((await prisma.company.count({
                    where:{
                        companyName
                    }
                })) >= 1)
                if(existAlready===true){
                    // if companyName already exist, finish routine
                    return false;
                }
                //// add logic for upload logo and return logoId
                const fileObj:FileObj = await prisma.fileObj.create({
                    data:{
                        isPublic:true,
                        fileName:"pastelLogo.png",
                        fileType:"png"
                    }
                })
                const logoId = fileObj.id;

                await prisma.company.create({
                    data:{
                        companyName,
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