import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../Context/Appcontext'
import {assets}  from "../assets/assets"
import { toast } from 'react-toastify'
import axios from 'axios'
const Myprofile = () => {
const {userdata , Setuserdata , token , backendurl , loaduserprofiledata} = useContext(AppContext)
const [isedit , Setisedit] = useState(false)
const [image , Setimage] = useState(false)

const updateuserprofiledata = async()=>{
try {
  const formdata = new FormData()
  formdata.append("name" , userdata.name)
  formdata.append("phone" , userdata.phone)
  formdata.append("address" ,JSON.stringify(userdata.address))
formdata.append("gender" , userdata.gender)
formdata.append("dob" , userdata.dob)

image && formdata.append("image" , image)
const {data} = await axios.post(backendurl+"/api/users/updateprofile" , formdata , {headers:{token}})
if(data.success){
  toast.success(data.message)
  await loaduserprofiledata()
  Setisedit(false)
  Setimage(false)
}
else{
  toast.error(data.message)
}

} catch (error) {
  console.log(error)
  toast.error(error.message)
}
}


  return userdata &&   (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

{
  isedit?<label htmlFor='image'>
    <div className='inline-block relative cursor-pointer' >
      <img className='w-36 rounded opacity-50' src={image?URL.createObjectURL(image):userdata.image}></img>
      <img className='w-10 absolute bottom-12 right-12 ' src={image?"":assets.upload_icon}></img>
    </div>
    <input onChange={(e)=>Setimage(e.target.files[0])} type='file' id="image" hidden></input>
  </label>
  
  
  :<img className='w-36 rounded' src={userdata.image}></img>
}


{
  isedit?<input  className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type='text'value={userdata.name} onChange={e=>Setuserdata(prev=>({...prev , name:e.target.value}))}></input>:<p className=' font-medium text-3xl text-neutral-800 mt-4'>{userdata.name}</p>
}
<hr className='bg-zinc-400 h-[1px] border-none'/>
<div>
  <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
  <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
    <p className='font-medium'>Email id:</p>
     <p className='text-blue-500'>{userdata.email}</p>
     <p className='font-medium' >Phone:</p>
     {
       isedit?<input type='text'value={userdata.phone} className='bg-gray-100 max-w-52' onChange={e=>Setuserdata(prev=>({...prev , phone:e.target.value}))}></input>:<p className='text-blue-400' >{userdata.phone}</p>
     }
     <p className='font-medium'>Address:</p>



    {
      isedit? <p><input className='bg-gray-50' type="text" value={userdata.address.line1}  onChange={e=>Setuserdata(prev=>({...prev , address:{...prev.address , line1:e.target.value} }))} /> <br/><input type="text" value={userdata.address.line2} className='bg-gray-50' onChange={e=>Setuserdata(prev=>({...prev , address:{...prev.address , line2:e.target.value} }))} /></p> : <p className='text-gray-500'>{userdata.address.line1} <br/> {userdata.address.line2}</p>
    }


  </div>
</div>
<div>
  <p className='text-neutral-500 underline mt-3' >BASIC INFORMATION</p>
  <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700' >
    <p className='font-medium'>Gender:</p>
    {
  isedit?<select className='max-w-28 bg-gray-100' onChange={(e)=>Setuserdata(prev=>({...prev ,gender:e.target.value }))}>
    <option value="Male">Male</option>
     <option value="Female">Female</option>
  </select>
  
  :<p className='text-gray-400'>{userdata.gender}</p>
}

<p className='font-medium'>DOB</p>
{
  isedit?<input  className='max-w-28 bg-gray-100' type='date' value={userdata.dob} onChange={(e)=>Setuserdata(prev=>({...prev , dob:e.target.value}))}></input> : <p className='text-gray-400'>{userdata.dob}</p>
}
  </div>
</div>
<div className='mt-10'>
  {
    isedit?<button className='border border-primary px-8 py-2 rounded-full hover:text-white hover:bg-primary transition-all' onClick={updateuserprofiledata}>Save Information</button> : 
    <button  className='border border-primary px-8 py-2 rounded-full  hover:text-white hover:bg-primary transition-all' onClick={()=>Setisedit(true)} >Edit</button>
  }
</div>
    </div>
  )
}

export default Myprofile