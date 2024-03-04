const Joi = require('joi');

const vehicleTypeSchema = Joi.object({
  type: Joi.string().required(),
  price: Joi.number().min(0).required() // Allow for 0 and positive numbers.
});

const dealerSchema = Joi.object({
  name: Joi.string().required(),
  country: Joi.string().required(),
  averageInvoiceMaturityDays: Joi.number().positive().integer().required(),
  averageDeliveryTime: Joi.number().positive().integer().required()
});

const warehouseSchema = Joi.object({
  name: Joi.string().required(),
  assignedDealer: Joi.string().required(), // Assuming this will be an ObjectId in string format
  averageWaitingTimeDays: Joi.number().positive().integer().required(),
  maximumVehicleCapacity: Joi.number().positive().integer().required()
});

const orderSchema = Joi.object({
  dealer: Joi.string().required(),
  country: Joi.string().required(),
  vehicleType: Joi.string().required(),
  numberOfVehiclesOrdered: Joi.number().positive().integer().required()
});

const countrySchema = Joi.object({
  name: Joi.string().required(),
  vehicleTypesOrdered: Joi.number().positive().integer(),
  totalPrice: Joi.number().min(0)
});

module.exports = {
  countrySchema,
  vehicleTypeSchema,
  dealerSchema,
  warehouseSchema,
  orderSchema
};