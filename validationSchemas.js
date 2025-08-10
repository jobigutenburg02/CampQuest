const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

// Joi extension that adds a rule to ensure the string contains no HTML tags or attributes
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.htmlSafe': '{{#label}} must not include HTML!'
    },
    rules: {
        htmlSafe: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                })
                if(clean !== value) return helpers.error('string.htmlSafe', { value })
                return clean
            }
        }
    }
})

// Joi instance extended with the defined custom validation rule
const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().htmlSafe(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().htmlSafe(),
        description: Joi.string().required().htmlSafe()
    }).required(),
    deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().htmlSafe()
    }).required()
})

module.exports = { campgroundSchema, reviewSchema }