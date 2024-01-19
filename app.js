const express=require("express");
const mongoose=require("mongoose");
const port=3000;
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');//FOR STYLING
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");  
const {listingSchema}=require("./schema.js");
const Review=require("./models/review.js");

const app=express();
const path=require("path") //for ejs


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


main()
    .then(()=>{
        console.log('Connection Successful! DB Connected!');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(port,()=>{
    console.log("Server is listening to port 3000")
})

app.get("/",(req,res)=>{
    res.send("Server Working!")
})

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Succesful Testing!")
// })


//INDEX ROUTE: 
app.get("/listings",async(req,res)=>{
    allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
})

//NEW ROUTE: GET REQUEST:
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//SHOW ROUTE: READ
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

//CREATE ROUTE: 
app.post("/listings",wrapAsync(async (req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid listing data.");
    // }
    listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    const newListing=new Listing(req.body.listing);
    await newListing.save()
    res.redirect("/listings");
}));

//EDIT ROUTE:
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});

//UPDATE ROUTE:
app.patch("/listings/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid listing data.");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//DELETE ROUTE:
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});
