const Joi = require('joi');

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

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("", null),
        category : Joi.string().valid(...CATEGORIES).required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object().keys({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});