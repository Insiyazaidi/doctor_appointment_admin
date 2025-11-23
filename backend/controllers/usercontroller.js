import validator from "validator"
import bcrypt from "bcrypt"
import {usermodel} from "../models/usermodel.js"
import jwt from "jsonwebtoken"
import {v2 as cloudinary} from "cloudinary"
import { doctormodel } from "../models/doctorsmodel.js"
import appointmentmodel from "../models/appointmentmodel.js"
import razorpay from "razorpay"
// api to register user 
const registeruser = async(req,res)=>{
try {
    const {name , email , password} = req.body 
   
    if(!name || !email || !password){
        return res.json({success:false  , message:"missing details"})
    }
    if(!validator.isEmail(email)){
         return res.json({success:false  , message:"enter a valid email"})
    }
    if(password.length<8){
         return res.json({success:false  , message:"enter a strong password"})
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password , salt)

    const userdata = {name , email , password:hashedpassword}
    const newuser = new usermodel(userdata)
    const user = await newuser.save()
    const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
    res.json({success:true , token})
    // _id


} catch (error) {
     console.log(error) 
     return res.json({success:false , message:error.message})
}
}

const loginuser = async(req,res)=>{
    try {
       const {email , password} = req.body
       const user = await usermodel.findOne({email})
       if(!user){
        return res.json({success:false , message:"user does not exist "})
       }
       const ismatch = await bcrypt.compare(password, user.password)
       if(ismatch){
        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
        res.json({success:true , token })
       }
       else {
         res.json({success:false ,message:"invalid credentials "  })
       }

    } catch (error) {
        console.log(error) 
     return res.json({success:false , message:error.message})
    }

}

// api to get user profile 
  const getprofile = async(req,res)=>{
      try {
       const userid = req.userid
    console.log(userid)
    const userdata = await usermodel.findById(userid).select("-password")
   return  res.json({success:true , userdata})
  } 

  catch (error) {
     console.log(error)
    return   res.json({success:false , message:error.message})
  }
  }
// //  // api to update user profile
  const updateprofile = async(req,res)=>{
      try {
 const userid = req.userid;
        let { name , phone , address , dob , gender}= req.body
         const imagefile = req.file
          if( !name || !phone  || ! dob  || ! gender){
   return res.json({success:false , message:"data missing "})
           }
if (typeof address === "string") {
  try {
    address = JSON.parse(address);
    if (typeof address === "string") {
      address = JSON.parse(address);
    }
  } catch (err) {
    console.log("❌ Address parse failed:", err);
    return res.json({ success: false, message: "Invalid address format" });
  }
}

          await usermodel.findByIdAndUpdate(userid , {name , phone , address , dob,gender})
          if(imagefile){
              const imageupload = await cloudinary.uploader.upload(imagefile.path , {resource_type:"image"})
              const imageurl = imageupload.secure_url
                            await usermodel.findByIdAndUpdate(userid , {image:imageurl})
           //   console.log(imageupload)
          }
       //   console.log(userid)
          res.json({success:true , message:"profile updated" , userid , name , phone , address , dob , gender})
      } 
      catch (error) {
           console.log(error)
   return   res.json({success:false , message:error.message})
     }
  }

   // api to book appointment 
   const bookappointment = async(req,res)=>{
try {
  const userid = req.userid
  const {docId , slotdate , slottime}= req.body
  //console.log(userid )
  const docdata = await doctormodel.findById(docId).select("-password")  
 // console.log(docdata);
   if(!docdata.available){
     return res.json({success:false, message:"doctor not available"})
   }
   let slots_booked = docdata.slots_booked
  // // checking for slits availability 
   if(slots_booked[slotdate]){
     if(slots_booked[slotdate].includes(slottime)){
        return res.json({success:false, message:"slot not available"})
     }
     else{
       slots_booked[slotdate].push(slottime)
     }

   }
   else{
    slots_booked[slotdate] = []
    slots_booked[slotdate].push(slottime)
   }
   const userdata = await usermodel.findById(userid).select("-password")
   delete docdata.slots_booked
   const appointmentdata = {
     userid , docId , userdata , docdata , amount:docdata.fees, slottime , slotdate , date:Date.now() 
   }
  // console.log( "appointment data ", appointmentdata)

   const newappointment = new appointmentmodel(appointmentdata)
   await newappointment.save()
  // // save new slots data in doctors data 
   await doctormodel.findByIdAndUpdate(docId , {slots_booked})
   res.json({success:true , message:"appointment booked"})
} 

catch (error) {
           console.log(error)
   return   res.json({success:false , message:error.message})
}
   }
   
 // api to get user appointments for frontend my appointment page
 const listappointment = async(req,res)=>{
const userid = req.userid
const appointments = await appointmentmodel.find({userid})
console.log(appointments)
res.json({success:true , appointments})
 } 


 // api to cancel the appointment 
 const cancelappointment = async(req,res)=>{
  try {
    const userid = req.userid 
    console.log(userid)
    const { appointmentid} = req.body
     console.log(appointmentid)
     const appointmentdata = await appointmentmodel.findById(appointmentid)
     // verify appoitment userr
     if(appointmentdata.userid !=userid){
      return res.json({success:false , message:"unauthorized action "})
     }
   await appointmentmodel.findByIdAndUpdate(appointmentid , {cancelled:true})

   // releasing doctor slot 
   const {docId , slotdate , slottime} = appointmentdata
   const docdata = await doctormodel.findById(docId)
   let slots_booked = docdata.slots_booked
   slots_booked[slotdate] = slots_booked[slotdate].filter(e=>e!==slottime)  // if slotime is matched then it will be removed 
   await doctormodel.findByIdAndUpdate(docId , {slots_booked})
   res.json({success:true , message:"Appointment cancelled"})
  } catch (error) {
     console.log(error)
   return   res.json({success:false , message:error.message})
  }
 }

// const razorpayinstance = new razorpay({
//   key_id:process.env.RAZORPAY_KEY_ID,
//   key_secret:process.env.RAZORPAY_KEY_SECRET
// })
// api to make payment of appointment 
// const paymentrazorpay = async(req,res)=>{

//   try {
//     const {appointmentid} = req.body 
// const appointmentdata = await appointmentmodel.findById(appointmentid)
// if(!appointmentdata || appointmentdata.cancelled){
//   return res.json({success:false, message:"Appointment cancelled or not found"})
// }

// // creating option for razorpay payment
// const options = {
//   amount:appointmentdata.amount*100,
//   currency : process.env.CURRENCY ,
//   receipt : appointmentid
// }
// const order = await razorpayinstance.orders.create(options)
// res.json({success:true , order})
//   } catch (error) {
//     console.log(error)
//    return   res.json({success:false , message:error.message})
//   }

// } 








export {registeruser , loginuser , getprofile , updateprofile , bookappointment ,  listappointment , cancelappointment } 