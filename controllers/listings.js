const Listing =  require("../models/listing.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req,res) => {
    const allListing  = await Listing.find({});
    res.render('./listings/index.ejs', { allListing });

    // Listing.find({}).then(res => {
    //     console.log(res);
    // })
}

module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs")
}

module.exports.showListings = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews" , populate: {path : "author"}}).populate("owner");

    if( !listing ) {
        req.flash("error" , "listing you are searching doesn't exist");
        res.redirect("/listings");
    }
    console.log(listing); 
    res.render("./listings/show.ejs" , {listing});
}

module.exports.createListing = async(req,res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    // if(!req.body.listing) {
    //     throw new expressError(400 , "Please provide a listing.");
    // }

    // console.log("Request Body:", req.body.listing);

    // using JOI
    let result_of_listingSchema = listingSchema.validate(req.body);
    console.log(result_of_listingSchema);
    
    if(result_of_listingSchema.error){
        throw new expressError(400 , result_of_listingSchema.error);
    }

    const newListing = new Listing(req.body.listing);

    // if(!newListing.title) {
    //     throw new expressError(400, "Please provide a title for the listing.");
    // }
    // if(!newListing.description) {
    //     throw new expressError(400, "Please provide a description for the listing.");
    // }
    // if(!newListing.location) {
    //     throw new expressError(400, "Please provide a location for the listing.");
    // }

    console.log("req.user",req.user);
    newListing.owner = req.user._id;

    newListing.image = {url , filename};

    await newListing.save();
    req.flash("success" , "new Listing added!");
    res.redirect("/listings");
}

module.exports.editListing = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if( !listing ) {
        req.flash("error" , "listing you are searching doesn't exist");
        res.redirect("/listings");
    }

    let originalImg = listing.image.url;
    originalImg = originalImg.replace("/upload","/upload/h_180,w_250")

    res.render("./listings/edit.ejs" , { listing , originalImg })
}

module.exports.destroyListing = async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing deleted!");

    res.redirect(`/listings`);
}

module.exports.updateListing = async (req,res) => {
        // if(!req.body.listing) {
        //     throw new expressError(400, "send a valid listing data");
        // }
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

        if(typeof req.file != "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url ,filename};
            await listing.save();
        }

        req.flash("success" , "Listing Updated.");
        res.redirect(`/listings/${id}`);
}