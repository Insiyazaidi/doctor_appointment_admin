import { createContext } from "react";
import axios from "axios"
import { useState } from "react";
import { useEffect } from "react";
import {toast}  from "react-toastify"
export const AppContext = createContext();
const AppContextProvider=(props)=>{
const backendurl = import.meta.env.VITE_BACKEND_URL
    const currencysymbol = '$'
const [token , Settoken] = useState(localStorage.getItem("token")?localStorage.getItem("token") :false )
const [doctors , Setdoctors] = useState([])
   const [userdata , Setuserdata] = useState(false)

    const getdoctordata = async()=>{
        try {
 const {data} =  await axios.get(backendurl+"/api/doctor/list")
 if(data.success){
Setdoctors(data.doctors)
 }
 else{
    toast.error(data.message)
 }
            
        } catch (error) {
           console.log(error) 
        }
    }

     const loaduserprofiledata =async()=>{
         try {
           
            const {data} = await axios.get(backendurl+"/api/users/getprofile" , {headers:{token}}) 
            if(data.success){
             Setuserdata(data.userdata)
            }
            else{
             toast.error(data.message)
           }

    } catch (error) {
            console.log(error) 
             toast.error(error.message)
         }
     }

        const value={
doctors , currencysymbol , token , Settoken , backendurl , userdata, Setuserdata , loaduserprofiledata , getdoctordata
    }



    useEffect(()=>{
        getdoctordata();
    } , [])


    useEffect(()=>{
        if(token){
            loaduserprofiledata()
        }
else{
    Setuserdata(false)
}
    } , [token])
    
    return(
        <AppContext.Provider value={value}>
{props.children}
        </AppContext.Provider>
    )
}

export  default AppContextProvider