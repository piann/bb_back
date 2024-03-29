import { PrismaClient, ReasonOfLock, Role, User } from "@prisma/client";
import {generateSaltedHash, checkEmailChars, checkOnlyNormalChars, sendAuthSecretMail} from "../../../utils";
import crypto from "crypto";


const prisma = new PrismaClient()

export default{
    Mutation:{
        registerAccount: async(_, args:any):Promise<boolean> => {
            // 회원가입
            try{
                const {
                    realName,
                    nickName,
                    password,
                    email,
                    phoneNumber,
                } = args;

                const isEmailRightFormat:boolean = checkEmailChars(email);
                const isIdRightFormat:boolean = checkOnlyNormalChars(nickName);
                
                if(isEmailRightFormat===false || isIdRightFormat===false || nickName.length < 3){// || password.length < 8 ){ // submitted password is now hash value, so it is not valid check routine
                    return false;
                }

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
                    return false;

                }
                
                
                // Create user with input information and hashed password.
                const passwordHash:string = generateSaltedHash(password);

                const randomHex1 = crypto.randomBytes(14).toString('hex');
                const uHex = crypto.createHmac('md5',"@emailHash").update(email).digest('hex');
                const randomHex2 = crypto.randomBytes(14).toString('hex');
                const authSecret = randomHex1 + uHex + randomHex2;

                const createdUser:User = await prisma.user.create({
                    data: {
                        realName,
                        nickName,
                        passwordHash,
                        email,
                        phoneNumber,
                        isLocked:true,
                        reasonOfLock:ReasonOfLock.NEW_ACCOUNT,
                        role:Role.HACKER,
                        authSecret
                    }
                });

                const userId = createdUser.id;

                await prisma.hackerInfo.create({
                    data:{
                        user:{
                            connect:{id:userId}
                        }
                    }
                });

                const mailResult = await sendAuthSecretMail({
                    email,
                    nickName,
                    secret:authSecret
                })
                console.log("Send mail result : ",mailResult);////

                return true;

                

            } catch (err){
                console.log(err);
                return false;
            }
        }
    }
}