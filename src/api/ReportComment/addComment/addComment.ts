import { checkUserHasPermissionReport } from "../../../common";
import { PrismaClient, ReportComment, Role } from "@prisma/client";
import { sendEmail } from "../../../utils";

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
                        role,
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


                if(role!==Role.ADMIN){
                    
                    await sendEmail({
                        fromInfo:"zerowhale team <no-reply>",
                        toEmail:"support@pastelplanet.space",
                        title:"[notification] 리포트에 댓글이 작성되었습니다.",
                        content:"https://zerowhale.io/report_thread/"+rId,
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