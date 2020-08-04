import { isAuthenticated } from "../../../middleware";
import { PrismaClient, Role, ReportComment } from "@prisma/client";

const prisma = new PrismaClient()


export default{
    Mutation:{
        addComment: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                // check if user is login
                
                const {
                    content,
                    rId,
                    fileId
                } = args;

                const isAuth:boolean = isAuthenticated(request);
                if(isAuth===false){
                    // non login user is forbidden to access
                    return null
                }

                
                const {
                     user:{
                        id:uId,
                        role
                        } 
                    } = request;
                
                if(role!==Role.ADMIN){

                    const reportObj = await prisma.report.findOne({
                        where:{id:rId}
                    });
                    const authorId =reportObj?.authorId;
                    if(authorId!==uId){
                        // if not author, find in collaboratorList
                        const collaboratorObjList = await prisma.collaboratorInfo.findMany({
                            where:{
                                report:{id:rId}
                            },
                            select:{
                                user:{
                                    select:{
                                        id:true
                                    }
                                }
                            }
                        });
                        let collaboUserIdList = [] as any;
                        for (const collaboObj of collaboratorObjList){
                            collaboUserIdList.push(collaboObj.user.id);
                        }
                        const isCollaborator = collaboUserIdList.includes(uId);
                        if(isCollaborator===false){
                            return null;
                        }

                    }

                }
                //// add logic for checking business user

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