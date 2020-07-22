
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
    }
}
