import { PrismaClient, FileCategory } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";
import {checkUserHasPermissionReport} from "../../../common";

const prisma = new PrismaClient()

interface checkFileInfoResponse{
    ok:Boolean;
    fileType:String|undefined|null;
    fileName:String|undefined|null;
    category:String|undefined|null;
}


const utterFailResponse = {    
    ok:false,
    fileType:null,
    fileName:null,
    category:null
    
}

export default{
    Query:{
        checkFileInfo: async(_, args:any,{request }):Promise<checkFileInfoResponse> =>{
            try{
                const {
                    fileId,
                    //userId
                } = args;

                const fileObj = await prisma.fileObj.findUnique({
                    where:{
                        id:fileId
                    }
                })

                if(fileObj===null){
                    return utterFailResponse;
                }

                if(fileObj.isPublic!==true){
                    //// need to add logic for private file

                    return utterFailResponse;
                }


                // add logic by file type
                if(fileObj.category===FileCategory.REPORT){
                    
                    if(isAuthenticated(request)===false){
                        return utterFailResponse;
                    }

                    const ReportObjList = await prisma.report.findMany({
                        where:{
                            fileId
                        }
                    });

                    console.log(ReportObjList);////

                    if(ReportObjList===null || ReportObjList.length===0){
                        return utterFailResponse;
                    }
                    const rId = ReportObjList[0].id;
                    if(await checkUserHasPermissionReport(request, rId)!==true){
                        return utterFailResponse;
                    } else {
                        return {
                            ok:true,
                            fileType:fileObj.fileType,
                            fileName:fileObj.fileName,
                            category:fileObj.category
                        }
                    }

                
            }

                return {
                    ok:true,
                    fileType:fileObj.fileType,
                    fileName:fileObj.fileName,
                    category:fileObj.category
                }




            }catch(err){
                console.log(err);
                return {
                    ok:false,
                    fileType:null,
                    fileName:null,
                    category:null
                }
            }
        }
    }
}