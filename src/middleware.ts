export const isAuthenticated:any = request => {
    try{
        const user = request.user
        if(user !== null){
            return true
        }else{
            return false
        }
    }catch(e){
        console.log(e)
        return false;
    }
    
}