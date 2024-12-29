const express = require("express");
const router = express();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isowner, validateFunc } = require("../middleware.js");

// controller
const listingController = require("../controllers/listings");

// multer (for handling multipart/form-data)  => basically image uploads <= 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// router.route path for ("/") 
router.route("/")
    .get(
        wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateFunc,
        wrapAsync(listingController.createListing)
    )

// new route
router.get("/new", 
    isLoggedIn,
        listingController.renderNewForm
)

// router.route path for ("/:id") 
router.route("/:id")
    .get(
        wrapAsync(listingController.showListings))
    .put(isLoggedIn,isowner,
        upload.single('listing[image]'),
        validateFunc, 
        wrapAsync(listingController.updateListing)
    )

// edit route
router.get("/:id/edit" 
        ,isLoggedIn
            ,isowner
                ,wrapAsync(listingController.editListing)
)
// delete route 
router.get("/:id/delete" 
    ,isLoggedIn
        ,isowner
            ,wrapAsync(listingController.destroyListing)
)


// this is routed in router.route

// index route (all listing)
// router.get("/" 
//     , wrapAsync(listingController.index)
// );


// show route
// router.get("/:id",
//     wrapAsync(listingController.showListings)
// )

// this is routed in router.route

// post route (server side error handling) 
// router.post("/", 
//     isLoggedIn,
//     validateFunc,
//     wrapAsync(listingController.createListing)
// )

// update route 
// router.put(
//     "/:id" ,
//         isLoggedIn,isowner, 
//             wrapAsync(listingController.updateListing)
// )

        // const validateFunc = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const errorMsg = error.details.map((el) => el.message).join(",");
//         return res.status(400).send(errorMsg);
//     }
//     next();
// };

// create post request

// error handling
// router.post("/", async(req,res,next) => {
//     try {
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     } catch (err) {
//         next(err);
//     }
// })

//  <------------------------------------------------------------------>
// test delete this later

// router.post("/:id/test" , wrapAsync(async (req , res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     res.render("./listings/test.ejs" , {listing});
// }))

//  <------------------------------------------------------------------>


module.exports = router;