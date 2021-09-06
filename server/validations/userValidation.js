const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


const userValidation = Joi.object({ 
    name: Joi.string().min(6) .required(),
    
    password: Joi.string().min(6).required() });
    
   
	
	module.exports=userValidation;
