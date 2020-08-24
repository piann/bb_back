import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface checkFileInfoResponse{
    ok:Boolean;
    fileType:String|undefined|null;
    fileName:String|undefined|null;
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
                }

                return {
                    ok:true,
                    fileType:fileObj?.fileType,
                    fileName:fileObj?.fileName
                }


            }catch(err){
                console.log(err);
                return {
                    ok:false,
                    fileType:null,
                    fileName:null
                }
            }
        }
    }
}