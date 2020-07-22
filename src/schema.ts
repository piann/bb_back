
import {makeExecutableSchema} from "graphql-tools"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from "path";

const allTypes:any = loadFilesSync(path.join(__dirname, "/api/**/*.graphql"));
const allResolvers:any = loadFilesSync(path.join(__dirname, "/api/**/*.ts"));


const schema:any = makeExecutableSchema({
    typeDefs:mergeTypeDefs(allTypes),
    resolvers:Object.assign(mergeResolvers(allResolvers))
})

export default schema;