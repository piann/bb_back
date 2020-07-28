import { PrismaClient, ReasonOfLock, Role } from "@prisma/client";
import {generateSaltedHash} from "../../../utils";

const prisma = new PrismaClient()


export default{
    Mutation:{
        registerAccount: async(_, args:any):Promise<boolean> => {
            // 회원가입
            try{
                const {
                    lastName,
                    firstName,
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
                            lastName,
                            firstName,
                            passwordHash,
                            email,
                            phoneNumber,
                            isLocked:true,
                            reasonOfLock:ReasonOfLock.NEW_ACCOUNT,
                            role:Role.HACKER
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