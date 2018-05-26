const PRODUCTS_API_URL = '/products'

const table = document.querySelector('tbody.products-list')
const editForm = document.querySelector('form.edit-entry')
const cancelButton = document.querySelector('form.edit-entry input[name="Cancel"]')
const deleteButton = document.querySelector('form.edit-entry input[name="Delete"]')
const searchBar = document.querySelector('input.search')

createTable()

document.querySelectorAll('.sort').forEach(column => column.addEventListener('click', handleSort))
editForm.addEventListener('submit', handleEditFormSubmit)
deleteButton.addEventListener('click', handleEditFormDelete)
cancelButton.addEventListener('click', handleEditFormCancel)
searchBar.addEventListener('input', handleSearch)

const FIELDS = [
  'Author',
  'Date',
  'Country',
  'Product_Name',
  'Availability',
  'Symptom',
  'availability_en',
  'availability_for',
  'mongoId'
]

const state = {
  products: [],
  editingMongoId: null
}

function createTable (products) {
  table.innerHTML = ''
  if (products) return state.products.forEach(product => createRow(product))
  axios.get(PRODUCTS_API_URL)
    .then(res => {
      state.products = res.data
      state.products.forEach(product => createRow(product))
    })
}

function createRow (product) {
  const row = document.createElement('tr')
  ;['Edit', ...FIELDS].forEach(attribute => {
    row.appendChild(createCell(attribute, product))
  })
  table.appendChild(row)
}

function createCell (attribute, product) {
  const cell = document.createElement('td')
  if (attribute === 'Edit') {
    const anchor = document.createElement('a')
    anchor.href = '#'
    anchor.innerText = 'Edit'
    anchor.addEventListener('click', editItem)
    cell.appendChild(anchor)
  } else {
    if (attribute === 'mongoId') {
      cell.classList.add('hidden', 'mongo-id')
      attribute = '_id'
    }
    cell.innerText = product[attribute]
  }
  return cell
}

function handleEditFormSubmit (event) {
  event.preventDefault()
  axios.put(`${PRODUCTS_API_URL}/${state.editingMongoId}`, getFormData())
    .then(res => {
      state.products = res.data
      createTable(state.products)
    })
  editForm.classList.add('hidden')
  state.editingMongoId = null
}

function getFormData () {
  const formData = {_id: state.editingMongoId}
  Array.from(editForm.children).reduce((dataFromForm, child) => {
    const input = child.querySelector('input')
    if (input) dataFromForm[input.name] = input.value
    return dataFromForm
  }, formData)
  return formData
}

function handleSort (event) {
  event.preventDefault()
  const header = event.target.dataset.field
  console.log(header)
}

function handleSearch (event) {
  console.log(event.target.value)
}

function handleEditFormDelete (event) {
  event.preventDefault()
  axios.delete(`${PRODUCTS_API_URL}/${state.editingMongoId}`).then(_ => {
    clearEditForm()
    createTable()
  })
}

function handleEditFormCancel (event) {
  event.preventDefault()
  clearEditForm()
}

function clearEditForm () {
  document.querySelectorAll('form.edit-entry input').forEach(input => {
    if (input.type !== 'submit') input.value = ''
  })
  editForm.classList.add('hidden')
}

function editItem (event) {
  event.preventDefault()
  state.editingMongoId = event.target.parentNode.parentNode.querySelector('.mongo-id').innerText
  editForm.classList.remove('hidden')
  populateForm(state.editingMongoId)
}

function populateForm (mongoId) {
  const product = adaptFields(state.products.find(product => product._id === mongoId))
  Object.keys(product).forEach(attribute => {
    const selectionAttribute = attribute === '_id' ? 'mongoId' : attribute
    const input = editForm.querySelector(`input[name^="${selectionAttribute}"]`)
    if (input) input.value = product[attribute]
  })
  window.scrollTo(0, 0)
}

function adaptFields (product) {
  return Object.keys(product).reduce((newProduct, attribute) => {
    newProduct[attribute] = product[attribute]
    if (attribute === 'Date') newProduct[attribute] = formattedDate(product[attribute])
    if (attribute.toLowerCase().includes('avail')) newProduct[attribute] = newProduct[attribute] ? 'yes' : 'no'
    return newProduct
  }, {})
}

// replace with moment
function formattedDate (dateString) {
  const date = new Date(dateString)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
