import {prisma} from "../../../../generated/prisma-client"
import {generateSaltedHash} from "../../../utils";

const NEW_ACCOUNT = "NEW_ACCOUNT";

export default{
    Mutation:{
        registerAccount: async(_, args) => {
            try{
                const {
                    name,
                    password,
                    email,
                    phoneNumber,
                } = args;
                const existEmail = await prisma.$exists.user({email});
                if(existEmail===true){
                    console.log("This e-mail already exists")
                    return false
                } else{
                    
                    const passwordHash = generateSaltedHash(password);
                    const reasonOfLockForNewAccount = await prisma.reasonOfLock({value:NEW_ACCOUNT});
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