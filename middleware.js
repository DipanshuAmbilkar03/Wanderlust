const Listing = require("./models/listing.js");
const Review = require("./models/review.js"); 
const { listingSchema , reviewSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js");


module.exports.isLoggedIn = (req,res,next) => {
// when user is not logged in 
    if(!req.isAuthenticated()) {
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you are not logged in");
        return res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isowner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not authorized to access or modify this post.");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let { reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not authorized to modify this review.");
        return res.redirect(`/listings/${reviewId}`);
    }

    next();
}

// validation lisitings
module.exports.validateFunc = (req, res, next) => {
    // using JOI
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        let errMsg = error.details.map(
            (el) => el.message
        ).join(","); 
        throw new expressError(400 , errMsg);
    }else {
        next();
    }
}

// validate review function 
module.exports.validateReview = (req, res, next) => {
    // using JOI
    let {error} = reviewSchema.validate(req.body);
    
    if(error) {
        let errMsg = error.details.map(
            (el) => el.message
        ).join(","); 
        throw new expressError(400 , errMsg);
    }else {
        next();
    }
}