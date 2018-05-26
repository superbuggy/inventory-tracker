const express = require('express')
const multer = require('multer')
const uploader = multer({ storage: multer.memoryStorage() })
const fastCSV = require('fast-csv')
const router = express.Router()
const Product = require('../models/product')
const { trimFields, formatRows } = require('../utils/csvHelpers')

router.get('/products', (req, res) => {
  Product.find({})
    .then(products => res.json(products))
})
router.get('/', (req, res) => {
  res.sendFile(__dirname.replace('controllers', '') + '/public/index.html')
})

router.post('/csv', uploader.single('file'), (req, res) => {
  if (!req.file) return res.json({ error: 'No File.' })
  let rows = []
  fastCSV.fromString(req.file.buffer.toString(), { headers: true })
    .on('data', objectFromCSVRow => rows.push(objectFromCSVRow))
    .on('end', _ => Product.create(formatRows(rows))
      .catch(anOopsy => console.error(anOopsy))
      .then(_ => res.redirect('/'))
    )
})

module.exports = router
