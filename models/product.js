const mongoose = require('mongoose')

const Product = new mongoose.Schema({
  Author: String,
  Date: String,
  Country: String,
  Product_Name: String,
  Availability: Boolean,
  Symptom: String,
  availability_en: Boolean,
  availability_for: Boolean
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', Product)
