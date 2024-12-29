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

module.exports = router;

//  <------------------------------------------------------------------>