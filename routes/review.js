const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview, isloggedin, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")



// note
// note : validatereview is not working 


// reviews route
router.post("/",isloggedin,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isloggedin,isReviewAuthor, wrapAsync(reviewController.destroy))


module.exports = router;