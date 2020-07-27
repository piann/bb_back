import { PrismaClient } from "@prisma/client";
import {generateSaltedHash} from "../../../utils";

const prisma = new PrismaClient()

const NEW_ACCOUNT = "NEW_ACCOUNT";



export default{
    Mutation:{
        registerAccount: async(_, args:any):Promise<boolean> => {
            // 회원가입
            try{
                const {
                    name,
                    password,
                    email,
                    phoneNumber,
                } = args;
                const checkUser:number = await prisma.user.count({where:{email}});
                let existEmail:boolean;
                if(checkUser>=1){
                    existEmail=true;
                }else{
                    existEmail=false;
                }
                if(existEmail===true){
                    // Duplicate account check
                    console.log("This e-mail already exists")
                    return false
                } else{
                    // Create user with input information and hashed password.
                    const passwordHash:string = generateSaltedHash(password);


                    
                    await prisma.user.create({
                        data: {
                            name,
                            passwordHash,
                            email,
                            phoneNumber,
                            isLocked:true,
                            reasonOfLock:NEW_ACCOUNT
                        }
                    });

                    return true;

                }

            } catch (err){
                console.log(err);
                return false;
            }
        }
    }
}