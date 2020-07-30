import fs from "fs";

export default {
    Query:{
        hello: async (_,args,{request,isAuthenticated}) => {
            const res = isAuthenticated(request);
            console.log(request);
            const {user} = request;
            console.log(user);
            console.log(res);
            return "Hello";
        }
    },
    Mutation: {
        singleUpload: async (_, {file}) => {
          console.log(file);
          const { filename, mimetype, encoding, createReadStream } = await file;
          
          const readFileStream = createReadStream();
          const writeFileStream = fs.createWriteStream("test4.png")
          writeFileStream.write("test");
          await readFileStream.pipe(writeFileStream);

          const returnFile = { filename, mimetype, encoding };
          return returnFile;
        }
      }
}
