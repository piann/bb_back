import {prisma, User} from "../../../../generated/prisma-client"
import {compareSaltedHash, generateToken} from "../../../utils";


const INVALID_MSG = "INVALID";
const ACCOUNT_LOCKED_MSG = "LOCKED"

interface SignInResponse{
    ok:Boolean;
    error:String|null;
    token:String|null;
}

export default{
    Mutation:{
        signIn: async(_, args:any):Promise<SignInResponse> =>{
            try{
                const{
                    email,
                    password
                } = args;
                const existEmail:boolean = await prisma.$exists.user({email});
                if(existEmail===false){
                    console.log("This e-mail doesn't exist");
                    return {
                        ok:false,
                        error:INVALID_MSG,
                        token:null
                    };

                } else {
                    const user:User | null = await prisma.user({email});
                    if(user==null){
                        return {
                            ok:false,
                            error:INVALID_MSG,
                            token:null
                        };
                    }
                    if(user.isLocked===true){
                        console.log("This account is locked");
                        return {
                            ok:false,
                            error:ACCOUNT_LOCKED_MSG,
                            token:null
                        };
                    } else {
                        const passwordHash:string = user.passwordHash;
                        const isSuccess:boolean = compareSaltedHash(password, passwordHash);
                        if (isSuccess===true){
                            await prisma.updateUser({data:{numberOfLoginTrial:0},where:{id:user.id}})
                            return {
                                ok:true,
                                error:null,
                                token:generateToken(user.id)
                            }
                        } else {
                            console.log("Wrong password")
                            const numberOfLoginTrial:number = (user.numberOfLoginTrial)+1;
                            await prisma.updateUser({data:{numberOfLoginTrial},where:{id:user.id}});
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