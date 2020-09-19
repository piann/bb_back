import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../../../middleware";
import { generateSaltedHash, compareSaltedHash } from "../../../utils";

const prisma = new PrismaClient()


export default{
    Mutation:{
        modifyPassword: async(_, args:any,{request}):Promise<boolean|null> =>{
            try{
                
                const {
                    oldPassword,
                    newPassword
                } = args;
                if(isAuthenticated(request)===false){
                    return false;
                }
                const { user:{id,passwordHash}} = request;

                if(compareSaltedHash(oldPassword,passwordHash)===false){
                    console.log("Wrong Old Password")
                    return false;
                }
                await prisma.user.update({
                    data:{
                        passwordHash:generateSaltedHash(newPassword)
                    },
                    where:{
                        id
                    }
                });


                return true;

            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}