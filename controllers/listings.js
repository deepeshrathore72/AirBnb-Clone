const Listing = require("../models/listing");
const User = require("../models/user");
const { uploadToCloudinary } = require("../cloudConfig");
const { CATEGORIES } = require("../models/listing");

// Index route with search and category filter
module.exports.index = async (req, res) => {
    const { search, category } = req.query;
    
    // Build query object
    let query = {};
    
    // Handle search (location, country, or title)
    if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i'); // case-insensitive
        query.$or = [
            { location: searchRegex },
            { country: searchRegex },
            { title: searchRegex }
        ];
    }
    
    // Handle category filter
    if (category && category !== 'All' && CATEGORIES.includes(category)) {
        query.category = category;
    }
    
    // Fetch listings with reviews populated for rating calculation
    const allListings = await Listing.find(query).populate('reviews');
    
    // Get user's liked listings if logged in
    let userLikes = [];
    if (req.user) {
        const user = await User.findById(req.user._id);
        userLikes = user.likedListings.map(id => id.toString());
    }
    
    // Calculate average rating for each listing
    const listingsWithRating = allListings.map(listing => {
        const listingObj = listing.toObject();
        if (listing.reviews && listing.reviews.length > 0) {
            const sum = listing.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
            listingObj.avgRating = (sum / listing.reviews.length).toFixed(1);
            listingObj.reviewCount = listing.reviews.length;
        } else {
            listingObj.avgRating = null;
            listingObj.reviewCount = 0;
        }
        listingObj.isLiked = userLikes.includes(listing._id.toString());
        return listingObj;
    });
    
    res.render("listings/index.ejs", { 
        allListings: listingsWithRating,
        categories: CATEGORIES,
        currentCategory: category || 'All',
        searchQuery: search || ''
    });
};

module.exports.renderNewForm = async(req, res)=>{
    res.render("listings/new.ejs", { categories: CATEGORIES });
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    
    // Calculate average rating
    let avgRating = null;
    if (listing.reviews && listing.reviews.length > 0) {
        const sum = listing.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        avgRating = (sum / listing.reviews.length).toFixed(1);
    }
    
    // Check if user has liked this listing
    let isLiked = false;
    if (req.user) {
        const user = await User.findById(req.user._id);
        isLiked = user.likedListings.includes(id);
    }
    
    res.render("listings/show.ejs", { listing, avgRating, isLiked });
};

module.exports.createListing = async (req, res, next)=> {
    // Upload file to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    let url = result.secure_url;
    let filename = result.public_id;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.locals.originalImageUrl = originalImageUrl;
    res.render("listings/edit.ejs", { listing, categories: CATEGORIES });
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(req.file){
        // Upload new file to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        let url = result.secure_url;
        let filename = result.public_id;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
};

// Toggle like for a listing
module.exports.toggleLike = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    const listing = await Listing.findById(id);
    
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    
    const likeIndex = user.likedListings.indexOf(id);
    let isLiked;
    
    if (likeIndex === -1) {
        // Not liked, add to likes
        user.likedListings.push(id);
        isLiked = true;
    } else {
        // Already liked, remove from likes
        user.likedListings.splice(likeIndex, 1);
        isLiked = false;
    }
    
    await user.save();
    
    res.json({ success: true, isLiked });
};

// Get user's wishlist
module.exports.getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'likedListings',
        populate: { path: 'reviews' }
    });
    
    // Calculate average rating for each listing
    const listingsWithRating = user.likedListings.map(listing => {
        const listingObj = listing.toObject();
        if (listing.reviews && listing.reviews.length > 0) {
            const sum = listing.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
            listingObj.avgRating = (sum / listing.reviews.length).toFixed(1);
            listingObj.reviewCount = listing.reviews.length;
        } else {
            listingObj.avgRating = null;
            listingObj.reviewCount = 0;
        }
        listingObj.isLiked = true;
        return listingObj;
    });
    
    res.render("listings/wishlist.ejs", { 
        allListings: listingsWithRating,
        categories: CATEGORIES,
        currentCategory: 'All',
        searchQuery: ''
    });
};