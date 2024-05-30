const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



module.exports.createReview=async (req,res)=>{   // validateReview pass as middleware
    let {id} = req.params; 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log(req.body);
   req.flash("success","new review created")


    res.redirect(`/listings/${id}`);
    // res.redirect("back")
    
};

module.exports.destroy = async (req,res)=>{
    let {id,reviewId} = req.params;
     
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});           // to delete the reveiw


    await Review.findByIdAndDelete(reviewId);
   req.flash("success","reveiw deleted successfully")

    // res.redirect(`/listings/${id}`);
    res.redirect("back")
}
