// const { verify } = require("jsonwebtoken");
const User = require("../models/User");
const {verifyToken,verifyTokenAndAuthorisation,verifyTokenAndAdmin} =require("./verifyToken");
const router=require("express").Router();

/*******************Admin Section Starts******************************/

//Get
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        const {password,...others}=user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json("Failed to get the User...");
    }
});


//Get All Users...
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query=req.query.new;                //Get User as per Query
    try{
        const users=query?await User.find().sort({_id:-1}).limit(5):await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json("Failed to get the Users...");
    }
});


//Get users Stats
router.get("/stats/",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.getFullYear(date.getFullYear() - 1));

    try{
        const data=await User.aggregate([
            {
                $match:{
                createdAt:{$gte:lastYear}}},
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ]);

        res.status(201).json(data);
    }catch(err){
        res.status(500).json(err);
    }

});


/*******************Admin Section End******************************/

//Update
router.put("/:id",verifyTokenAndAuthorisation,async (req,res)=>{
    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_PASS
        ).toString();
    }
    console.log(req.body);
    try{
        const updatedUser=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});


//Delete
router.delete("/:id",verifyTokenAndAuthorisation,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(201).json("User deleted successfully...");
    }catch(err){
        res.status(500).json("Failed to delete the User...");
    }
});




module.exports=router;