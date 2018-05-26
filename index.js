const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const productsController = require('./controllers/products')
const db = require('./db/connection')

app.use(bodyParser.json())
app.use('/public', express.static('public'))
app.use('/', productsController)

app.set('port', 3000)
app.listen(app.get('port'), _ => console.log(`Server running on port ${app.get('port')}`))
