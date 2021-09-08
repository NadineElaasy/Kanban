const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


const userValidation = Joi.object({ 
    //TODO: add regex to start only with letter
    name: Joi.string().min(6).max(30).alphanum().required(), 
    password: Joi.string().min(8).max(30).required()});
    
   
	
	module.exports=userValidation;
