const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require ("../controllers/reviews.js");






//POST ROUTE for REVIEWS
router.post("/",
    isLoggedIn, validateReview,  wrapAsync(reviewController.createReview));

//DELETE ROUTE for REVIEWS
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     wrapAsync(reviewController.deleteReview));

module.exports = router;