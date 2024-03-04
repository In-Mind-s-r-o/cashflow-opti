const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warehouseSchema = new Schema({
  name: { type: String, required: true },
  assignedDealer: { type: Schema.Types.ObjectId, ref: 'Dealer', required: true },
  averageWaitingTimeDays: { type: Number, required: true },
  maximumVehicleCapacity: { type: Number, required: true }
});

warehouseSchema.index({ name: 1 }, { unique: true });
warehouseSchema.index({ assignedDealer: 1 });

warehouseSchema.post('save', function(doc) {
  console.log(`Warehouse "${doc.name}" with ID ${doc._id} has been saved.`);
});

warehouseSchema.post('remove', function(doc) {
  console.log(`Warehouse "${doc.name}" with ID ${doc._id} has been removed.`);
});

warehouseSchema.post('findOneAndUpdate', function(doc) {
  if (doc) {
    console.log(`Warehouse "${doc.name}" with ID ${doc._id} has been updated.`);
  }
});

warehouseSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    console.log(`Warehouse "${doc.name}" with ID ${doc._id} has been deleted.`);
  }
});

warehouseSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error(`There was a duplicate key error for Warehouse "${doc.name}":`, error.message, error.stack);
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error(`Error saving warehouse "${doc.name}":`, error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;