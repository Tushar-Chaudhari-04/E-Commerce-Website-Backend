const Order = require("../models/Order");
const { verifyToken,verifyTokenAndAuthorisation,verifyTokenAndAdmin } = require("./verifyToken");
const router=require("express").Router();

//Add Orders
router.post("/",verifyToken,async(req,res)=>{
    const newOrder=new Order(req.body);
    try{
        const savedOrder=await newOrder.save();
        res.status(201).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});


//Update Orders
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    
    try{
        const updatedOrder=await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});


//Delete Order 
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(201).json("Order deleted successfully...");
    }catch(err){
        res.status(500).json("Failed to delete the Order...");
    }
});

//Get User Order 
router.get("/find/:userId",verifyTokenAndAuthorisation,async(req,res)=>{
    try{
        const orders=await Order.find({userId:req.params.userId});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json("Failed to get the Order...");
    }
});


//Get All Orders
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
           const orders=await Order.find();
            res.status(200).json(orders);
    }catch(err){
        res.status(500).json("Failed to get All Orders...");
    }
});


//Get Monthly Income

router.get("/income",verifyTokenAndAdmin,async(req,res)=>{

    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1));
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try{
        const income=await Order.aggregate([
            {
                $match:{
                    createdAt:{$gte:previousMonth}
                }
            },
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"}
                }
            }
        ]);
        res.status(201).json(income);
    }catch(err){
        res.status(500).json(err);
    }
});



module.exports=router;