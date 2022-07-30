const router=require("express").Router();
const User = require("../models/User");
const CryptoJS=require("crypto-js");
const JWT=require("jsonwebtoken");

//Register Section
router.post("/register",async(req,res)=>{
    const newUser=new User({
        userName:req.body.userName,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(              ///Encryption for User Password
            req.body.password,
            process.env.SECRET_PASS
            ).toString()
    });

    try{
        const savedUser=await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
});


//Login
router.post("/login",async(req,res)=>{
    
    try{
        const user=await User.findOne({userName:req.body.userName});

        !user && res.status(401).json("Wrong Credentials");

        const hashPassword=CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_PASS
        );

        const OriginalPassword=hashPassword.toString(CryptoJS.enc.Utf8);
        OriginalPassword!=req.body.password &&
        res.status(401).json("Wrong Credentials are given.Please provide valid Credentials");
        
        const accessToken=JWT.sign(
        {
            id:user._id,
            isAdmin:user.isAdmin,
        },process.env.JWT_SEC_KEY,
        {expiresIn:"3d"}
    );

        const {password,...others}=user._doc;

        res.status(200).json({...others,accessToken});

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports=router;