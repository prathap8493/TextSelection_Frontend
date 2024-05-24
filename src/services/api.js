import axios from "axios"

export const verifyTextService = async(text) =>{
    try{
        const data={
            text:text
        }
        const res = await axios.post("https://textselection-backend-5.onrender.com/validate",data)
        return res?.data;
    }
    catch(error){
        console.log(error)
    }
}