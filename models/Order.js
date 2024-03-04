const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  dealer: { type: Schema.Types.ObjectId, ref: 'Dealer', required: true },
  country: { type: String, required: true },
  vehicleType: { type: Schema.Types.ObjectId, ref: 'VehicleType', required: true },
  numberOfVehiclesOrdered: { type: Number, required: true }
});

// Create indexes for efficient querying
orderSchema.index({ dealer: 1, country: 1, vehicleType: 1 }, { unique: true });

orderSchema.post('save', function(doc) {
  console.log(`Order ${doc._id} saved. Dealer: ${doc.dealer}, Country: ${doc.country}, Vehicle Type: ${doc.vehicleType}, Quantity: ${doc.numberOfVehiclesOrdered}`);
});

orderSchema.post('remove', function(doc) {
  console.log(`Order ${doc._id} removed. Dealer: ${doc.dealer}, Country: ${doc.country}, Vehicle Type: ${doc.vehicleType}, Quantity: ${doc.numberOfVehiclesOrdered}`);
});

orderSchema.post('findOneAndUpdate', function(doc) {
  if (doc) {
    console.log(`Order ${doc._id} updated. Dealer: ${doc.dealer}, Country: ${doc.country}, Vehicle Type: ${doc.vehicleType}, Quantity: ${doc.numberOfVehiclesOrdered}`);
  }
});

orderSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    console.log(`Order ${doc._id} deleted. Dealer: ${doc.dealer}, Country: ${doc.country}, Vehicle Type: ${doc.vehicleType}, Quantity: ${doc.numberOfVehiclesOrdered}`);
  }
});

orderSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error(`Error saving order: ${error.message}`, error.stack);
    next(error);
  } else {
    next();
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;