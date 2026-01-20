const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Define allowed categories (8 categories only)
const CATEGORIES = [
    "Beachfront",
    "Mountains",
    "Iconic Cities",
    "Castles",
    "Camping",
    "Luxury",
    "Countryside",
    "Boats"
];

const listingSchema = new Schema({
    title : {
        type: String, 
        required: true
    },
    description : String,
    image : {
        url : String,
        filename : String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    category : {
        type : String,
        enum : CATEGORIES,
        required : true
    }
});

// Create indexes for search optimization
listingSchema.index({ location: 'text', country: 'text', title: 'text' });
listingSchema.index({ category: 1 });
listingSchema.index({ location: 1 });
listingSchema.index({ country: 1 });

// Virtual for average rating
listingSchema.virtual('avgRating').get(function() {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => {
        return acc + (review.rating || 0);
    }, 0);
    return (sum / this.reviews.length).toFixed(1);
});

// Ensure virtuals are included in JSON
listingSchema.set('toJSON', { virtuals: true });
listingSchema.set('toObject', { virtuals: true });

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({ _id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);

// Export both the model and categories
module.exports = Listing;
module.exports.CATEGORIES = CATEGORIES;