const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")// Index Route ,Create Route
.get(wrapAsync(listingController.index))  // Gets all listings and renders to index page
.post(
    isLoggedIn, 
    upload.single('listing[image]'),validateListing,
    wrapAsync(listingController.createListing)
);

// Wishlist Route (must be before /:id to avoid conflict)
router.get("/wishlist", isLoggedIn, wrapAsync(listingController.getWishlist));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Like/Unlike Route
router.post("/:id/like", isLoggedIn, wrapAsync(listingController.toggleLike));

router.route("/:id") // Delete Route, Update Route, Show Route
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn, 
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;