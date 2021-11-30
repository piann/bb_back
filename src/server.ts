import "./env";
import path from "path";
import { GraphQLServer } from "graphql-yoga";
import morgan from "morgan";
import schema from "./schema";
import "./passport";
import { authenticateJwt } from "./passport";
import {isAuthenticated} from "./middleware";
import fs from "fs";

// init
const PORT:number|string = process.env.PORT || 4000;
const server = new GraphQLServer({schema, context:({request})=>({
    request, isAuthenticated
  })
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, "..","server.log"), { flags: 'a'});
const fileLogObj = morgan("combined",{
  stream: accessLogStream
})
const consoleLogObj = morgan("combined")

// middle
server.express.use(fileLogObj);
server.express.use(consoleLogObj);
server.express.use(authenticateJwt);


// run
server.start({ port: PORT}, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

