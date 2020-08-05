import { PrismaClient, Role, User } from "@prisma/client";
import {generateSaltedHash} from "../../../utils";

const prisma = new PrismaClient()


export default{
    Mutation:{
        registerAccountForBusiness: async(_, args:any,{request, isAuthenticated}):Promise<boolean> => {
            // 관리자에서 등록해주기
            // 임시비밀번호 만들어주고 추후 패스워드 바꿀 수 있게 기능추가
            try{
                //// add logic for checking ADMIN
                const {
                    lastName,
                    firstName,
                    nickName,
                    password,
                    email,
                    phoneNumber,
                    companyName,
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

                const isCompanyExisting:boolean = ((await prisma.company.count({
                    where:{
                        companyName
                    }
                })) >= 1)
                if(isCompanyExisting===false){
                    // if companyName doesn't exist, finish routine
                    console.log("Register company first")
                    return false;
                }
                
                const isNickNameExisting:boolean = (await prisma.user.count({
                    where:{
                        nickName
                    }
                }) >=1 );
                
                if(isNickNameExisting===true){
                    // Duplicate nickName check
                    console.log("This nickName already exists")
                    return false

                }

                // Create user with input information and hashed password.
                const passwordHash:string = generateSaltedHash(password);
                
                const createdUser:User = await prisma.user.create({
                    data: {
                        lastName,
                        firstName,
                        nickName,
                        passwordHash,
                        email,
                        phoneNumber,
                        isLocked:false,
                        // reasonOfLock:ReasonOfLock.NEW_ACCOUNT,
                        role:Role.BUSINESS,
                        
                    }
                });
                const userId = createdUser.id;

                await prisma.businessInfo.create({
                    data:{
                        company:{
                            connect:{companyName}
                        },
                        user:{
                            connect:{id:userId}
                        }
                    }
                })

                return true;

                

            } catch (err){
                console.log(err);
                return false;
            }
        }
    }
}