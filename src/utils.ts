import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = id => jwt.sign({id}, process.env.JWT_SECRET);

export const generateSaltedHash = (pw:string):string => {
    if (process.env.I_AM_SALT===undefined){
        throw Error("Enviroment error")
    }
    const hashedPassword:string= crypto.createHmac('sha3-512',process.env.I_AM_SALT).update(pw).digest('hex');
    return hashedPassword

}

export const compareSaltedHash = (pw:string,savedPasswordHash:string):boolean => {
    if (process.env.I_AM_SALT===undefined){
        throw Error("Enviroment error")
    }
    const hashedPassword:string= crypto.createHmac('sha3-512',process.env.I_AM_SALT).update(pw).digest('hex');
    if(hashedPassword===savedPasswordHash){
        return true;
    }else{
        return false;
    }
}
