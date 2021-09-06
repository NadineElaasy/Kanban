const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const boardValidation = Joi.object({
  name: Joi.string().min(6).required(),
  owner: Joi.objectId(),
});

module.exports = boardValidation;
