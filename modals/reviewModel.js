const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedUserId: { type: Schema.Types.ObjectId, required: true },
  reviewedEntityType: { type: String, enum: ['User', 'Business'], required: true }, // Renamed field for clarity
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Added validation for rating
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Indexing fields for faster queries
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ reviewedUserId: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
