import axios from "axios"

export const verifyTextService = async(text) =>{
    try{
        const data={
            text:text
        }
        const res = await axios.post("http://localhost:8000/validate",data)
        return res?.data;
    }
    catch(error){
        console.log(error)
    }
}