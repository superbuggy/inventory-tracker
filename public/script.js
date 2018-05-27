const PRODUCTS_API_URL = '/products'

const table = document.querySelector('tbody.products-list')
const editForm = document.querySelector('form.edit-entry')
const newButton = document.querySelector('button.new-entry')
const cancelButton = document.querySelector('form.edit-entry input[name="Cancel"]')
const deleteButton = document.querySelector('form.edit-entry input[name="Delete"]')
const searchBar = document.querySelector('input.search')

createTable()

document.querySelectorAll('.sort').forEach(column => column.addEventListener('click', handleSort))
editForm.addEventListener('submit', handleEditFormSubmit)
deleteButton.addEventListener('click', handleEditFormDelete)
cancelButton.addEventListener('click', handleEditFormCancel)
searchBar.addEventListener('input', handleSearch)
newButton.addEventListener('click', handleEditFormNew)

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
  editingMongoId: null,
  filters: initFilters()
}

function initFilters () {
  return FIELDS.slice(0, -1).reduce((filters, field) => {
    filters[field] = false
    return filters
  }, {})
}

function createTable (products) {
  console.log('createTable')
  table.innerHTML = ''
  // if (products) return state.products.forEach(product => createRow(product))
  if (products) {
    products.forEach(product => {
      console.log('!')
      createRow(product)
    })
  } else {
    axios.get(PRODUCTS_API_URL)
      .then(res => {
        state.products = res.data
        state.products.forEach(product => createRow(product))
      })
  }
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
      createTable(state.editingMongoId ? state.products : null)
    })
  clearEditForm()
}

function getFormData () {
  const formData = {_id: state.editingMongoId}
  Array.from(editForm.children).reduce((dataFromForm, child) => {
    const input = child.querySelector('input')
    if (input) dataFromForm[input.name] = input.value
    return dataFromForm
  }, formData)
  return Object.assign(formData, {
    Availability: formData.Availability.toLowerCase().includes('in'),
    availability_en: formData.availability_en.toLowerCase().includes('y'),
    availability_for: formData.availability_for.toLowerCase().includes('y')
  })
}

function handleSort (event) {
  event.preventDefault()
  const header = event.target.dataset.field
  console.log(header)
  state.products = state.products.sort((previous, current) => {
    return previous[header].toString().charCodeAt(0) - current[header].toString().charCodeAt(0)
  })
  state.filters[header] = !state.filters[header]
  createTable(state.filters[header] ? state.products : state.products.reverse())
}

function handleSearch (event) {
  const queryProducts = state.products
    .map(product => {
      const productSansId = Object.assign({}, product)
      delete productSansId._id
      delete productSansId.updatedAt
      delete productSansId.createdAt
      return Object.values(productSansId).join('').toLowerCase()
    })
  const filteredResults = state.products.filter((_, i) => queryProducts[i].includes(event.target.value.toLowerCase()))
  createTable(event.target.value ? filteredResults : state.products)
}

function handleEditFormNew (event) {
  clearEditForm()
  editForm.classList.remove('hidden')
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
  state.editingMongoId = null
  editForm.classList.add('hidden')
}

function editItem (event) {
  event.preventDefault()
  state.editingMongoId = event.target.parentNode.parentNode.querySelector('.mongo-id').innerText
  editForm.classList.remove('hidden')
  populateForm(state.editingMongoId)
}

function populateForm (mongoId) {
  const product = adaptFieldsForPopulatingForm(state.products.find(product => product._id === mongoId))
  Object.keys(product).forEach(attribute => {
    const selectionAttribute = attribute === '_id' ? 'mongoId' : attribute
    const input = editForm.querySelector(`input[name^="${selectionAttribute}"]`)
    if (input) input.value = product[attribute]
  })
  window.scrollTo(0, 0)
}

function adaptFieldsForPopulatingForm (product) {
  return Object.keys(product).reduce((newProduct, attribute) => {
    newProduct[attribute] = product[attribute]
    if (attribute === 'Date') newProduct[attribute] = formattedDate(product[attribute])
    if (attribute.toLowerCase().includes('avail')) newProduct[attribute] = newProduct[attribute] ? 'yes' : 'no'
    return newProduct
  }, {})
}

// TODO: replace with moment.js ?
function formattedDate (dateString) {
  const date = new Date(dateString)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
