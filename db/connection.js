const MONGODB_URI = require('../config/db').url
const mongoose = require('mongoose')

mongoose
  .connect(MONGODB_URI)
  .then(adapter => console.log(`Connection established to db`))
  .catch(connectionError => {
    console.log('Connection failed!\n', connectionError, '\nClosing connection.')
    mongoose.connection.close()
  })

module.exports = mongoose
