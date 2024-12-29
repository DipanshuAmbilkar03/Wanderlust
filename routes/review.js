const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js"); 
const { validateReview , isLoggedIn ,isReviewAuthor} = require("../middleware.js");
// const { createReview } = require("../controllers/reviews.js");
const reviewController = require("../controllers/reviews.js");

// Review
router.post("/" 
    ,isLoggedIn
        ,validateReview
        ,wrapAsync(reviewController.createReview)
); 

// delete the review
router.delete("/:reviewId"
    ,isReviewAuthor
        ,wrapAsync(reviewController.destroyReview)
);

module.exports = router;    