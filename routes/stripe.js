const router=require("express").Router();
const stripe=require("stripe")("sk_test_51LTTsUSBWdfNHQa5F33UUfPEJwTpKKZxfrbpVS0fmlJV3RtmpfmcJbmdZk3CijC7ouuX1NN455vzgQPL9xXtVNrD00BuI0QXwF");
    //process.env.STRIPE_KEY);

router.post("/payment",async (req,res)=>{
    await stripe.charges.create(
        { 
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"usd"
    },
    (stripeErr,stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr);
        }
        else{
            res.status(201).json(stripeRes);
        }
    }
    )
});


module.exports=router;