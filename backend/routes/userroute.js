import express from "express"
import {  bookappointment, cancelappointment, getprofile, listappointment,  registeruser } from "../controllers/usercontroller.js"
import { loginuser } from "../controllers/usercontroller.js"
import authuser from "../middlewares/authuser.js"
import { updateprofile } from "../controllers/usercontroller.js"
import upload from "../middlewares/multer.js"
const userrouter = express.Router()
userrouter.post("/register" , registeruser)
userrouter.post("/login" , loginuser)
userrouter.get("/getprofile" ,authuser ,getprofile)
userrouter.post("/updateprofile" ,upload.single("image") ,authuser,updateprofile)
userrouter.post("/bookappointment" , authuser , bookappointment)
userrouter.get("/appointments" , authuser , listappointment)
userrouter.post("/cancelappointment" , authuser , cancelappointment)
//userrouter.post("/paymentrazorpay" , authuser, paymentrazorpay)
export default userrouter