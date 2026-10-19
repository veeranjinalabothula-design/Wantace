const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    party: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    item: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    qty: {
      type: Number,
      required: true,
      min: 0.01
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    rate: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'hold', 'return'],
      default: 'pending',
      required: true
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false
  }
);

module.exports = mongoose.model('Order', orderSchema);
