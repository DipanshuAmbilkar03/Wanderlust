const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); 

const listingItems = new Schema({
        title : { 
            type : String,
            required : true, 
        },
        description : String,
        image : {
            url : String,
            filename : String,
        },
        price : { 
            type : Number, 
            default : 0,
        },
        location : { 
            type : String,
        },
        country : { 
            type : String,
        },
        reviews : [
            {
                type : Schema.Types.ObjectId,
                ref : "Review",
            }
        ],
        owner :  { 
            type : Schema.Types.ObjectId,
            ref : "User",
        }
    });

// mongoose listing and review middeleWare
listingItems.post("findOneAndDelete" , async(listing)=>{
    if(listing) {
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("listing",listingItems);
module.exports = Listing;