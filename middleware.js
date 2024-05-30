const Listing =require("./models/listing.js");
const Review =require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")



module.exports.isloggedin = (req,res,next)=>{
        // console.log(req)
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            // console.log(req.session)
        req.flash("error","please logged in first");
            return res.redirect("/login")
    }
    next();
};  
// apply only login post request
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        // console.log(res.locals.redirectUrl)
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the listing")
        return res.redirect("/listings")
    }
    next()
};

module.exports.validateListing=(req,res,next)=>{            // create function so pass middleware
        let {error} = listingSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{            // create function so pass middleware
        let {error} =reviewSchema.validate(req.body);
        // console.log(req.body);
   
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


module.exports.isReviewAuthor  = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review")
        return res.redirect(`/listings/${id}`)
    }
    next()
};
