 import React, { useContext, useEffect, useState } from 'react'
 import axios from 'axios'
 import { AppContext } from '../Context/Appcontext'
import { toast } from 'react-toastify'
 const Myappointments = () => {
  const {backendurl , token , getdoctordata} = useContext(AppContext)
  const [appointments , Setappointments] = useState([])
  const months = ["", "Jan" , "Feb" , "Mar" ,"April", "May","Jun","July" ,"Aug" , "Sept" , "Oct" , "Nov","Dec"]
  const formatdate = (slotdate)=>{
const datearray = slotdate.split("_")
return datearray[0]+" "+months[Number(datearray[1])]+" "+datearray[2]
  }
  const cancelappointment = async(appointmentid)=>{
try {
  console.log(appointmentid)
 let {data} =  await axios.post(backendurl+"/api/users/cancelappointment" , {appointmentid} , {headers:{token}})
  if(data.success){
    toast.success(data.message)
    getuserappointmets()
 getdoctordata()
  }
  else{
    toast.error(data.message)
  }
} catch (error) {
    console.log(error)
      toast.error(error.message)
}
  }
  const getuserappointmets = async(req,res)=>{
    try {
      const {data} = await axios.get(backendurl+"/api/users/appointments" , {headers:{token}})
      if(data.success){
        Setappointments(data.appointments.reverse())
        console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

// const appointmentrazorpay = async(appointmentid)=>{
// try {
//   const {data} = await axios.post(backendurl+"/api/users/paymentrazorpay" , appointmentid , {headers:{token}})
//   if(data.success){
//     console.log(data.order)
//   }
// } catch (error) {
  
// }
// }


  useEffect(()=>{
if(token){
  getuserappointmets()
 
}
  } , [token])
   return (
     <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
      <div>
{
  appointments.map((item , index)=>(
    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
<div>
  <img className='w-32 bg-indigo-50 ' src={item.docdata.image}></img>
</div>
<div className='flex-1 text-sm text-zinc-600'>
  <p className='text-neutral-800 font-semibold'>{item.docdata.name}</p>
  <p>{item.docdata.speciality}</p>
   <p className='text-zinc-700 font-medium mt-1'>Address:</p>
  <p className='text-xs'>{item.docdata.address.line1}</p>
  <p className='text-xs'>{item.docdata.address.line2}</p>
  <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium' >Date & Time</span> {formatdate(item.slotdate)} | {item.slottime}</p>
</div>
<div></div>
<div className='flex flex-col gap-2 justify-end'>
 
 {
   !item.cancelled && <button onClick={()=>appointmentrazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary  hover:text-white transition-all duration-300'>Pay Online</button>
 }
 
 {
  !item.cancelled && <button onClick={()=>cancelappointment(item._id)}  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500  hover:text-white transition-all duration-300'>Cancel Appointment</button>
 }
   {
    item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>
   }
</div>
    </div>
    
  ))
}
      </div>
     </div>
   )
 }
 
 export default Myappointments