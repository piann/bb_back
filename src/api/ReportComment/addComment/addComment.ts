import { checkUserHasPermissionReport } from "../../../common";
import { PrismaClient, ReportComment } from "@prisma/client";

const prisma = new PrismaClient()


export default{
    Mutation:{
        addComment: async(_, args:any,{request}):Promise<string|null> =>{
            try{

                const {
                    content,
                    rId,
                    fileId
                } = args;

                const {
                     user:{
                        id:uId,
                        } 
                    } = request;
                
                if(await checkUserHasPermissionReport(request, rId)!==true){
                    return null;
                }

                let reportCommentObj:ReportComment|null = null;
                // main routine
                if(fileId===undefined){

                    reportCommentObj = await prisma.reportComment.create({
                        data:{
                            content,
                            writer:{connect:{id:uId}},
                            report:{connect:{id:rId}},
                        }
                    });
                } else {
                    reportCommentObj = await prisma.reportComment.create({
                        data:{
                            content,
                            writer:{connect:{id:uId}},
                            report:{connect:{id:rId}},
                            file:{connect:{id:fileId}}
                        }
                    });
                }



                return reportCommentObj?.id;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}