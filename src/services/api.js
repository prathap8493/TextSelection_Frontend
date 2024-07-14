import { api_url } from "@/config/config";
import axios from "axios"

export const verifyTextService = async(text) =>{
    try{
        const data={
            text:text
        }
        const res = await axios.post(`${api_url}/validate`,data)
        return res?.data;
    }
    catch(error){
        console.log(error)
    }
}

export const getUserDetailsService = async () => {
    const res = await axios.get(`${api_url}/userinfo`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
};

export const SaveUserTextService = async(text) =>{
    try{
        const data = {
            text:text
        }
        const res = await axios.post(`${api_url}/saveText`,data,{
                Headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
        })
        return res?.data;

    }
    catch(err){
        throw err;
    }
}

export const GetUserTextService = async(text) =>{
    try{
        const res = await axios.get(`${api_url}/saveText`,{
                Headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
        })
        return res?.data;

    }
    catch(err){
        throw err;
    }
}