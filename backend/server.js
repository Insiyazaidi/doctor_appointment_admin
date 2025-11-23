import express from "express" 
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
import connectdb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminrouter from "./routes/adminroute.js";
import doctorrouter from "./routes/doctorroute.js";
import userrouter from "./routes/userroute.js";
const app = express()
app.use(express.json())
const port = process.env.PORT|| 4000;

app.use(cors())

app.use("/api/doctor" , doctorrouter)
app.use("/api/admin" , adminrouter)
app.use("/api/users" , userrouter)
// http://localhost:4000/api/admin/add-doctor




app.listen(port , ()=>{
    console.log("server started")
    connectdb();
    connectCloudinary();
    console.log("cloudinary connected")
})