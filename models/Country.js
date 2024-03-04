const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleTypesOrdered: { type: Number },
  totalPrice: { type: Number },
});

// Indexes for efficient querying
countrySchema.index({ name: 1, country: 1 });

countrySchema.post('save', function(doc) {
  console.log(`Country "${doc.name}" in country "${doc.country}" saved.`);
});

countrySchema.post('remove', function(doc) {
  console.log(`Country "${doc.name}" in country "${doc.country}" removed.`);
});

countrySchema.post('findOneAndUpdate', function(doc) {
  if (doc) {
    console.log(`Country "${doc.name}" in country "${doc.country}" updated.`);
  }
});

countrySchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    console.log(`Country "${doc.name}" in country "${doc.country}" deleted.`);
  }
});

countrySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.log('There was a duplicate key error for Country:', error.message);
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error('Error saving country:', error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;