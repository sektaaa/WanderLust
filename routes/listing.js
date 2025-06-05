const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const ListingController = require("../controllers/listing.js");

const multer  = require('multer')
const {storage} = require ("../cloudConfig.js");
const upload = multer({ storage});


//Index and Create route
router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn, 
     upload.single("listing[image]"),
     validateListing,
      wrapAsync(ListingController.createNewListing)
);

//NEW ROUTE
router
.get("/new", isLoggedIn, ListingController.renderNewForm);

//Show, Update and Delete route
router.route("/:id")
.get(wrapAsync( ListingController.showListing))
.put(isLoggedIn, isOwner, 
     upload.single("listing[image]"),
     validateListing,
      wrapAsync(ListingController.updateRoute))
      .delete(isLoggedIn,  isOwner,  wrapAsync(ListingController.deleteListing)
);

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner,  
     wrapAsync(ListingController.renderEditForm)
);


module.exports = router;