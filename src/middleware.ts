export const isAuthenticated:any = request => {
    try{
        const user = request.user
        if(user === undefined || user === null){
            return false
        }else{
            return true
        }
    }catch(e){
        console.log(e)
        return false;
    }
    
}