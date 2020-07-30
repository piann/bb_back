import { PrismaClient, BugBountyProgram} from "@prisma/client";

const prisma = new PrismaClient()

export default{
    Mutation:{
        initBugBountyProgram: async(_, args:any,{request}):Promise<String|null> =>{
            try{
                //// add routine for check root

                const {companyName, isPrivate} = args;
                const bugBountyProgram:BugBountyProgram = await prisma.bugBountyProgram.create({
                    data:{
                        ownerCompany:{
                            connect:{companyName}
                        },
                        isPrivate

                    }
                });
                const bbpId = bugBountyProgram.id; 
                return bbpId;
            }catch(err){
                console.log(err);
                return null;
            }
        }
    }
}