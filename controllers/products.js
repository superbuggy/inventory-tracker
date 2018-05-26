const express = require('express')
const multer = require('multer')
const uploader = multer({ storage: multer.memoryStorage() })
const fastCSV = require('fast-csv')
const router = express.Router()
const Product = require('../models/product')

router.get('/products', (req, res) => {
  Product.find({})
    .then(products => res.json(products))
})
router.get('/', (req, res) => {
  res.sendFile(__dirname.replace('controllers', '') + '/public/index.html')
})

router.post('/csv', uploader.single('file'), (req, res) => {
  if (!req.file) return res.status(500).json({ error: 'No File.' })
  let rows = []
  fastCSV.fromString(req.file.buffer.toString(), { headers: true })
    .on('data', objectFromCSVRow => rows.push(objectFromCSVRow))
    .on('end', _ => {
      let schemaFormattedRows = formatRows(rows)
      Product.create(schemaFormattedRows)
        .catch(anOopsy => console.error(anOopsy))
        .then(_ => {
          Product.find()
            .then(products => res.redirect('/'))
            .catch(anOopsy => console.error(anOopsy))
        })
    })
})

function trimFields (untrimmedProduct) {
  return Object.keys(untrimmedProduct).reduce((product, field) => {
    product[field.trim()] = untrimmedProduct[field]
    return product
  }, {})
}

function formatRows (rows) {
  return rows.map(row => {
    return Object.assign(trimFields(row), {
      Availability: row.Availability.toLowerCase().includes('in'),
      availability_en: row.availability_en.toLowerCase().includes('y'),
      availability_for: row.availability_for.toLowerCase().includes('y')
    })
  })
  .filter(row => Object.keys(row).some(attribute => row[attribute]))
}

module.exports = router
