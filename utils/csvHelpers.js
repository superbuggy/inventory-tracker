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

module.exports = { formatRows, trimFields }
