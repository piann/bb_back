import { PrismaClient, FileCategory, Role} from "@prisma/client";
import path from 'path';
import { isAuthenticated } from "../../../middleware";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addReportFileObj: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                const {reportId, fileName} = args;
                if(isAuthenticated(request)===false){
                    console.log("should login first");
                    return null;
                }
                const {
                    user:{
                        id:uId,
                        role
                    }
                } = request;

                // hacker and admin can report

                if(role!==Role.HACKER && role!==Role.ADMIN){
                    return null;
                }

                if(role===Role.HACKER){
                    // if hacker, check report author is caller
                    const reportObj = await prisma.report.findUnique({
                        where:{
                            id:reportId
                        }
                    });
                    
                    if(reportObj===null){
                        return null;
                    }
                    if(reportObj.authorId!==uId){
                        return null;
                    }
                }

                const fileType = path.extname(fileName);
                if(fileType!==".zip"){
                    return null;
                }
                const fileObj = await prisma.fileObj.create({
                    data:{
                        isPublic:true,
                        fileName,
                        fileType,
                        category:FileCategory.REPORT,
                        uploadUser:{
                            connect:{id:uId}
                        }
                    }
                });
                const fileId = fileObj.id

                await prisma.report.update({
                    data:{
                        reportFile:{
                            connect:{id:fileId}
                        }
                    },
                    where:{
                        id:reportId
                    }
                });

                return fileId;
                
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}