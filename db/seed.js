const mongoose = require('./connection')
const Product = require('../models/product')

Product.remove({}).then(_ => {
  Product.find().then(products => {
    console.log('products cleared. current products:', products)
    mongoose.connection.close()
  })
})
