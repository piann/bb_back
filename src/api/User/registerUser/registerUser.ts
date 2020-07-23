import {prisma, ReasonOfLock} from "../../../../generated/prisma-client"
import {generateSaltedHash} from "../../../utils";

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
                const existEmail:boolean = await prisma.$exists.user({email});
                if(existEmail===true){
                    // Duplicate account check
                    console.log("This e-mail already exists")
                    return false
                } else{
                    // Create user with input information and hashed password.
                    const passwordHash:string = generateSaltedHash(password);
                    const reasonOfLockForNewAccount:ReasonOfLock|null  = await prisma.reasonOfLock({value:NEW_ACCOUNT});
                    console.log(reasonOfLockForNewAccount);
                    if(reasonOfLockForNewAccount==null){
                        return false;
                    }

                    
                    await prisma.createUser({
                        name,
                        passwordHash,
                        email,
                        phoneNumber,
                        isLocked:true,
                        reasonOfLock:{
                            connect:{id:reasonOfLockForNewAccount.id}
                        }, 
                    })
                    return true;

                }

            } catch (err){
                console.log(err);
                return false;
            }
        }
    }
}