const table = document.querySelector('.products-list')
const FIELDS = [
  'Author',
  'Date',
  'Country',
  'Product_Name',
  'Availability',
  'Symptom',
  'availability_en',
  'availability_for'
]

fetch('/products')
  .then(stream => stream.json())
  .then(products => {
    products.forEach(product => {
      const row = document.createElement('tr')
      FIELDS.forEach(attribute => {
        const cell = document.createElement('td')
        cell.innerText = product[attribute]
        row.appendChild(cell)
      })
      table.appendChild(row)
    })
  })

  // <td>'Author',</td>
  // <td>'Date',</td>
  // <td>'Country',</td>
  // <td>'Product_Name',</td>
  // <td>'Availability',</td>
  // <td>'Symptom',</td>
  // <td>'availability_en',</td>
  // <td>'availability_for',</td>
