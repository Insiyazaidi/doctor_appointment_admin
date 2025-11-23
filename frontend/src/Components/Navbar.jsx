import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets"
import { NavLink, useNavigate } from 'react-router'
import { AppContext } from '../Context/Appcontext'


const Navbar = () => {
    const navigate = useNavigate()
    const [shownmenu , Setshowmenu ] =useState(false)
   const {token , Settoken , userdata}=useContext(AppContext)

   const logout = ()=>{
    Settoken(false)
    localStorage.removeItem("token")

   }

  return (
    <div className='flex items-centre justify-between text-sm py-4 mb-5  border-b border-b-gray-400'>
    
        <img  src={assets.logo} className='w-44 cursor-pointer'  onClick={()=>navigate("/")}></img>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to="/"><li className='py-1 '>HOME</li ><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/></NavLink>
            <NavLink to="/doctors" >     <li className='py-1 '  >ALL DOCTORS</li><hr  className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'  /></NavLink>
            <NavLink to="/about">  <li className='py-1 '  >ABOUT</li><hr   className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'  /></NavLink>
            <NavLink  to="/contact"><li className='py-1 ' >CONTACT</li><hr   className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'  /></NavLink>
        </ul>
        <div>
            {
                token && userdata ? <div className='flex items-centre gap-2 cursor-pointer group relative'><img  className="w-7 h-7 rounded-full"src={userdata.image}>
                    </img>
                     <img className='w-2.5' src={assets.dropdown_icon}></img>
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden  group-hover:block'>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                    <p  onClick={()=>navigate("my-profile")}className='hover text-black cursor pointer'>My Profile</p>
                      <p  onClick={()=>navigate("my-appointments")} className='hover text-black cursor pointer'>My Appointment</p>
                        <p  onClick={logout} className='hover text-black cursor pointer'>Logout</p>
                    </div>
                  
                </div>
                </div>:<button className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block' onClick={()=>navigate("/login")}>Create account</button>
            }
            <img onClick={()=>Setshowmenu(true)} className='w-6 md:hidden mt-1' src={assets.menu_icon}></img>
<div className={` ${shownmenu ? "fixed w-full": "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
    <div className='flex items-center justify-between px-5 py-6'>
        <img className='w-36' src={assets.logo} /><img className='w-7' src={assets.cross_icon} onClick={()=>Setshowmenu(false)} />
    </div>
    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
        <NavLink onClick={()=>Setshowmenu(false)} to="/" ><p >HOME</p></NavLink>
        <NavLink  onClick={()=>Setshowmenu(false)} to="/doctors"  ><p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p></NavLink>
        <NavLink  onClick={()=>Setshowmenu(false)} to="/about" ><p className="px-4 py-2 rounded inline-block" >ABOUT</p></NavLink>
        <NavLink  onClick={()=>Setshowmenu(false)} to="/contact" ><p className="px-4 py-2 rounded inline-block">CONTACT</p></NavLink>
    </ul>
</div>
        </div>
        
    </div>
  )
}

export default Navbar