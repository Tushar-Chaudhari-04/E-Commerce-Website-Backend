const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const authRoute=require("./routes/auth");
const usersRoute=require("./routes/user");

dotenv.config();                           //dotenv stores all secret keys
const app=express();                       //app uses express for backend

mongoose
    .connect(process.env.MONGODB_URL)
    .then(()=>console.log("DB Connection Successfully"))
    .catch(err=>console.log(err));  //MongoDB Cloud Connection

app.use(express.json());
app.use("/shopify/auth",authRoute);
app.use("/shopify/users",usersRoute);


app.listen(process.env.PORT || 3000,()=>{           //Server Starting process...npm start
    console.log("Backend Server is Running...")
});
