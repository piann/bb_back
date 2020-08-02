//import { isAuthenticated } from "../../../middleware";
//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient()

/*
interface collaboratorInfo{
    userId:String;
    contributionRatio:Number;
}
*/


export default{
    Mutation:{
        submitReport: async(_, args:any,{request}):Promise<string|null> =>{
            try{
                // check if user is login

                /*
                const isAuth:boolean = isAuthenticated(request);
                if(isAuth===false){
                    // non login user is forbidden to access
                    return null
                }
                const { user:{id:uid} } = request;
                


                const { bbpId } = args;
                const bugBountyProgramObj:BugBountyProgram|null = await prisma.bugBountyProgram.findOne({
                    where:{
                        id:bbpId
                    }
                });
                if(bugBountyProgramObj===null){
                    return null
                }

                const isPrivate = bugBountyProgramObj.isPrivate;
                

                //  if it is private, check user is permitted
                if(isPrivate===true){

                    const isUserInPrivateProgram:boolean = ( await prisma.privateProgramConnUser.count({
                        where:{
                            bugBountyProgram:{
                                id:bbpId
                            },
                            permittedUser:{
                                id:uid
                            }

                        }
                    }) >= 1)
                    if(isUserInPrivateProgram===false){
                        return null
                    }


                }

                */
                // main routine

                console.log("test1")
                const {collaboratorInfoList} = args;
                for (const collaboratorInfo of collaboratorInfoList){
                    const uId = collaboratorInfo.userId;
                    const cRatio = collaboratorInfo.contributionRatio;
                    console.log(uId, cRatio);///
                }
                console.log("test2")

                ////reportId
                return "";
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}