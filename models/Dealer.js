const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  averageInvoiceMaturityDays: { type: Number, required: true },
  averageDeliveryTime: { type: Number, required: true },
});

// Indexes for efficient querying
dealerSchema.index({ name: 1, country: 1 });

dealerSchema.post('save', function(doc) {
  console.log(`Dealer "${doc.name}" in country "${doc.country}" saved.`);
});

dealerSchema.post('remove', function(doc) {
  console.log(`Dealer "${doc.name}" in country "${doc.country}" removed.`);
});

dealerSchema.post('findOneAndUpdate', function(doc) {
  if (doc) {
    console.log(`Dealer "${doc.name}" in country "${doc.country}" updated.`);
  }
});

dealerSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    console.log(`Dealer "${doc.name}" in country "${doc.country}" deleted.`);
  }
});

dealerSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.log('There was a duplicate key error for Dealer:', error.message);
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error('Error saving dealer:', error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

const Dealer = mongoose.model('Dealer', dealerSchema);

module.exports = Dealer;