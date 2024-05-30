const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema} = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const {isloggedin,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")

const multer  = require('multer')
const { storage} = require("../cloudConfig.js")
const upload = multer({storage})  // uploads naam k folder m save kardega automatic create upload dir

// all route for listings

//new route
router.get("/new",isloggedin,listingController.new);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedin,upload.single('listing[image]'),validateListing, wrapAsync(listingController.create));



router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isloggedin,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.update))
.delete(isloggedin,isOwner, wrapAsync(listingController.delete))



// index route 
// router.get("/", wrapAsync(listingController.index));



//create route
// try and catch hata k wrapasync laga diya hai
// router.post("/",isloggedin,validateListing, wrapAsync(listingController.create));

// show route
// router.get("/:id",wrapAsync(listingController.show));

//edit route
router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingController.edit));

//update route
// router.put("/:id",isloggedin,isOwner,validateListing, wrapAsync(listingController.update));

//Delete route
// router.delete("/:id",isloggedin,isOwner, wrapAsync(listingController.delete));

module.exports = router;