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
                    nickName,
                    password,
                    email,
                    phoneNumber,
                } = args;
                const isEmailExisting:boolean = (await prisma.user.count({
                    where:{
                        email
                    }
                }) >=1 );
                
                if(isEmailExisting===true){
                    // Duplicate account check
                    console.log("This e-mail already exists")
                    return false

                }

                const isNickNameExisting:boolean = (await prisma.user.count({
                    where:{
                        nickName
                    }
                }) >=1 );
                
                if(isNickNameExisting===true){
                    // // Duplicate nickName check
                    console.log("This nickName already exists")
                    return false

                }
                
                
                    // Create user with input information and hashed password.
                    const passwordHash:string = generateSaltedHash(password);


                    
                    await prisma.user.create({
                        data: {
                            lastName,
                            firstName,
                            nickName,
                            passwordHash,
                            email,
                            phoneNumber,
                            isLocked:true,
                            reasonOfLock:ReasonOfLock.NEW_ACCOUNT,
                            role:Role.HACKER
                        }
                    });

                    return true;

                

            } catch (err){
                console.log(err);
                return false;
            }
        }
    }
}