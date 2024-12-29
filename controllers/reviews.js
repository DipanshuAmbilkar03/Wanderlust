const Listing = require("../models/listing.js"); 
const Review = require("../models/review.js"); 

module.exports.createReview = async(req,res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);

    // reviews object
    // console.log(req.body.review);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    req.flash("success" , "new Review added!");
    await listing.save();

    console.log("new review is saved");
    
    let {id} = req.params;
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res) => {
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success" , "Listing deleted!");

    res.redirect(`/listings/${id}`);
}