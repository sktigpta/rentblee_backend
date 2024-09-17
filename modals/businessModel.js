const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./categoryModel');

const addressSchema = new Schema({
    street: { type: String },
    area: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
});

const businessSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessname: { type: String, required: true },
    about: { type: String, required: true },
    address: { type: addressSchema, required: true },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: { type: String, required: true },
    tan: { type: String },
    GSTIN: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }], // Reference to Category model
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
