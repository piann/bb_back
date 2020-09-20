import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface checkFileInfoResponse{
    ok:Boolean;
    fileType:String|undefined|null;
    fileName:String|undefined|null;
    category:String|undefined|null;
}


export default{
    Query:{
        checkFileInfo: async(_, args:any,{request }):Promise<checkFileInfoResponse> =>{
            try{
                const {
                    fileId,
                    //userId
                } = args;

                const fileObj = await prisma.fileObj.findOne({
                    where:{
                        id:fileId
                    }
                })

                if(fileObj?.isPublic!==true){
                    //// need to add logic for private file

                    return{
                        ok:false,
                        fileType:null,
                        fileName:null,
                        category:null
                    }
                }

                return {
                    ok:true,
                    fileType:fileObj?.fileType,
                    fileName:fileObj?.fileName,
                    category:fileObj?.category
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