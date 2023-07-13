import axios from "axios"
const ServerURL = "http://localhost:5000"


const getData = async(url)=>{
   try{ 
var response = await axios.get(`${ServerURL}/${url}`,{headers:{Authorization: "Bearer "+localStorage.getItem("TOKEN") }})
//console.log("Response",response)
var result = await response.data
return result 
   }
   catch(e){
    return null
   }
}


const posttData = async(url,body)=>{
   try{    
      var response=await axios.post(`${ServerURL}/${url}`,
     
      body,
      {headers:{Authorization: "Bearer "+localStorage.getItem("TOKEN") }})
      
      var result=await response.data
      return result
      }
    catch(e){
     return null
    }
 }


export {ServerURL,getData,posttData}