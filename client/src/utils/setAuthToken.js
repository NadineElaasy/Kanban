import axios from 'axios';

const setAuthToken = token=>{
    if(token){
        console.log("SET Token 1: ",token)
        console.log("SET Token 2: ",token.split(" ")[1])
        //apply to every request
        axios.defaults.headers.common['Authorization'] = token;
        

    }else{
        //if the token is not there then delete the header 
        delete axios.defaults.headers.common['Authorization'];

    }
};

export default setAuthToken;