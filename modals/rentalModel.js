// rentalModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  renterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rentStartDate: { type: Date, required: true },
  rentEndDate: { type: Date, required: true },
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
