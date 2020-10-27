import { sendBusinessRegisterMail } from "../../../utils";



export default{
    Mutation:{
        sendBusinessMail: async(_, args:any,{request }):Promise<boolean|null> =>{
            try{
                const {email, companyName, realName, jobTitle, phone} = args;


                const mailResult = await sendBusinessRegisterMail({
                    email,
                    companyName,
                    realName,
                    jobTitle,
                    phone
                });

                if(mailResult===true){
                    return true;
                }
                
                return false;

            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}