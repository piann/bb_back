import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        addProgramRule: async(_, args:any,{request}):Promise<boolean> =>{
            try{
                //// add routine for check root

                const {value} = args;

                await prisma.programRule.create({
                    data:{
                        value
                    }
                });
                
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    }
}