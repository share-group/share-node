const Joi = require('joi');

const {validate} = Joi;

Joi.validate = (param, schema, options = {
  convert: true,
  noDefaults: true,
  abortEarly: false,
  stripUnknown: true,
  allowUnknown: false,
}) => {
  const {value, error} = validate(param, schema, options);
  if (error) {
    throw error;
  }
  return value;
};

module.exports = Joi;
