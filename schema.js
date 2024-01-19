const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow(",",null)

    }).required()
});

//There much be a listing object in schema that must be reuired. In that obj, there must 
// be the title,price,description,location,country and all of it should 
//be required. Other than that, image can empty or have a null value. 