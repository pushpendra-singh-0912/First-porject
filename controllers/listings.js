const Listing = require("../models/listing.js")



module.exports.index=async (req,res)=>{
    let allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    
};

module.exports.new = (req,res)=>{

    res.render("listings/new.ejs");
    
};

module.exports.create=async (req,res,next)=>{        // pass validatelisting as middleware 

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing =  new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image = {url,filename}
   await newListing.save();
   req.flash("success","listing added successfully")
   res.redirect("/listings") 

};

module.exports.show=async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}}) // nested populate
    .populate("owner");
    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});

};

module.exports.edit =  async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.update =async (req,res)=>{
    
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined"){

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={url,filename}
        await listing.save();
    }
    req.flash('success',"listing update")
    res.redirect("back")
};

module.exports.delete = async (req,res)=>{
   if(req.user){
     let {id} = req.params;
    let dele = await Listing.findByIdAndDelete(id);
    console.log(dele);
   req.flash("success","listing deleted successfully")

    res.redirect("/listings");
   }

}