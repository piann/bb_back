import { PrismaClient,User } from "@prisma/client";
import {compareSaltedHash, generateToken } from "../../../utils";

const prisma = new PrismaClient()

const INVALID_MSG = "INVALID";
const ACCOUNT_LOCKED_MSG = "LOCKED"
const NEW_ACCOUNT = "NEW_ACCOUNT";

interface SignInResponse{
    ok:Boolean;
    error:String|null;
    token:String|null;
}

export default{
    Mutation:{
        signIn: async(_, args:any):Promise<SignInResponse> =>{
            // Login routine
            try{
                const{
                    email,
                    password
                } = args;
                
                const checkUser:number = await prisma.user.count({where:{email}});
                let existEmail:boolean;
                if(checkUser>=1){
                    existEmail=true;
                }else{
                    existEmail=false;
                }
                if(existEmail===false){
                    // There is no id.
                    console.log("This e-mail doesn't exist");
                    return {
                        ok:false,
                        error:INVALID_MSG,
                        token:null
                    };

                } else {
                    const user:User|null = await prisma.user.findUnique({
                        where:{email}
                    });
                    if(user==null){
                        // Fail to call prisma API.
                        return {
                            ok:false,
                            error:INVALID_MSG,
                            token:null
                        };
                    }

                    
                    if(user.isLocked===true){
                        // Need to unlock the account.
                        if(user.reasonOfLock==NEW_ACCOUNT){
                            return {
                                ok:false,
                                error:NEW_ACCOUNT,
                                token:null
                            }
                        }
                        console.log("This account is locked");
                        return {
                            ok:false,
                            error:ACCOUNT_LOCKED_MSG,
                            token:null
                        }; 
                    } else {
                        // Success to login.
                        const passwordHash:string = user.passwordHash;
                        const isSuccess:boolean = compareSaltedHash(password, passwordHash);
                        if (isSuccess===true){
                            await prisma.user.update({
                                data:{
                                    numberOfLoginFail:0,
                                },
                                where:{id:user.id}
                            })
                            return {
                                ok:true,
                                error:null,
                                token:generateToken(user.id)
                            }
                        } else {
                            // Password is wrong.
                            console.log("Wrong password")
                            const numberOfLoginFail:number = (user.numberOfLoginFail)+1;
                            await prisma.user.update({
                                data:{
                                    numberOfLoginFail,
                                },
                                where:{id:user.id}
                            });
                            return {
                                ok:false,
                                error:INVALID_MSG,
                                token:null
                            }
                        }
                    }
                }
            
            }catch(err){
                console.log(err);
                return {
                    ok:false,
                    error:err,
                    token:null
                };
            }
        }
    }
}