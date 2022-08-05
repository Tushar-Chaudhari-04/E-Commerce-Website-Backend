const Cart = require("../models/Cart");
const { verifyToken,verifyTokenAndAdmin, verifyTokenAndAuthorisation } = require("./verifyToken");
const router=require("express").Router();

//Add Cart
router.post("/",verifyToken,async(req,res)=>{
    const newCart=new Cart(req.body);
    try{
        const savedCart=await newCart.save();
        res.status(201).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

//Update Cart
router.put("/:id",verifyTokenAndAuthorisation,async (req,res)=>{
    try{
        const updatedCart=await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );
        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
});


//Delete Cart 
router.delete("/:id",verifyTokenAndAuthorisation,async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(201).json("Cart deleted successfully...");
    }catch(err){
        res.status(500).json("Failed to delete the Cart...");
    }
});


//Get Specific Cart 
router.get("/find/:userId",async(req,res)=>{
    try{
        const cart=await Cart.findOne({userId:req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json("Failed to get the Cart...");
    }
});


//Get All Cart
router.get("/",async(req,res)=>{
    try{
         const cartItems=await Cart.find();
         res.status(200).json(cartItems);
    }catch(err){
        res.status(500).json("Failed to get the CartItems...");
    }
});




module.exports=router;