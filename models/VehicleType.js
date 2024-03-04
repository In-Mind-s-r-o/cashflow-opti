const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  price: { type: Number, required: true }
});

vehicleTypeSchema.index({ type: 1 }); // Create an index on the 'type' field for efficient querying

vehicleTypeSchema.post('save', function(doc) {
  console.log(`New vehicle type "${doc.type}" with ID ${doc._id} has been saved.`);
});

vehicleTypeSchema.post('remove', function(doc) {
  console.log(`Vehicle type "${doc.type}" with ID ${doc._id} has been removed.`);
});

vehicleTypeSchema.post('findOneAndUpdate', function(doc) {
  console.log(`Vehicle type with ID ${doc._id} has been updated.`);
});

vehicleTypeSchema.post('findOneAndDelete', function(doc) {
  console.log(`Vehicle type with ID ${doc._id} has been deleted.`);
});

vehicleTypeSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error(`Error saving vehicle type: ${error.message}`, error);
    next(error);
  } else {
    next();
  }
});

const VehicleType = mongoose.model('VehicleType', vehicleTypeSchema);

module.exports = VehicleType;