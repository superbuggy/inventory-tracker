const PRODUCTS_API_URL = '/products'

const table = document.querySelector('tbody.products-list')
const editForm = document.querySelector('form.edit-entry')
const newButton = document.querySelector('button.new-entry')
const cancelButton = document.querySelector('form.edit-entry input[name="Cancel"]')
const deleteButton = document.querySelector('form.edit-entry input[name="Delete"]')
const searchBar = document.querySelector('input.search')

createTable()

document.querySelectorAll('.sort').forEach(column => column.addEventListener('click', handleSort))
document.querySelectorAll('thead td').forEach(header => header.addEventListener('click', handleFilter))
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
  filteredProducts: [],
  editingMongoId: null,
  filters: initSearchFilters()
}

function initSearchFilters () {
  return FIELDS.slice(0, -1).reduce((filters, field) => {
    filters[field] = {
      reversed: false,
      active: false
    }
    return filters
  }, {})
}

function createTable (products) {
  table.innerHTML = ''
  if (products) {
    products.forEach(product => createRow(changeBooleanFields(product)))
  } else {
    axios.get(PRODUCTS_API_URL)
      .then(res => {
        state.products = res.data
        state.filteredProducts = res.data
        state.products.forEach(product => createRow(changeBooleanFields(product)))
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
  event.stopPropagation()
  event.preventDefault()
  const header = event.target.dataset.field
  state.filteredProducts = state.filteredProducts.sort((previous, current) => {
    if (header !== 'Date') {
      return previous[header].toString().charCodeAt(0) - current[header].toString().charCodeAt(0)
    } else {
      let [previousDate, currentDate] = [new Date(previous.Date), new Date(current.Date)]
      return previousDate.getTime() - currentDate.getTime()
    }
  })
  state.filters[header].reversed = !state.filters[header].reversed
  let products = state.filters[header].reversed ? state.filteredProducts.reverse() : state.filteredProducts
  createTable(products)
}

function handleSearch (event) {
  const filterOnHeaders = Object.keys(state.filters).filter(filter => state.filters[filter].active)
  const queryProducts = state.products.map(product => {
    const changedProduct = changeBooleanFields(product)
    return filterOnHeaders.reduce((fieldsString, header) => {
      fieldsString += changedProduct[header]
      return fieldsString.toLowerCase()
    }, '')
  })
  state.filteredProducts = state.products.filter((_, i) => {
    return queryProducts[i].includes(event.target.value.toLowerCase())
  })
  state.filteredProducts = event.target.value ? state.filteredProducts : state.products
  createTable(state.filteredProducts)
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
  const product = changeBooleanFields(state.products.find(product => product._id === mongoId))
  Object.keys(product).forEach(attribute => {
    const selectionAttribute = attribute === '_id' ? 'mongoId' : attribute
    const input = editForm.querySelector(`input[name^="${selectionAttribute}"]`)
    if (input) input.value = product[attribute]
  })
  window.scrollTo(0, 0)
}

function changeBooleanFields (product) {
  return Object.keys(product).reduce((newProduct, attribute) => {
    newProduct[attribute] = product[attribute]
    if (attribute === 'Date') newProduct[attribute] = dateStringForDateInput(product[attribute])
    if (attribute.toLowerCase().includes('avail')) newProduct[attribute] = newProduct[attribute] ? 'yes' : 'no'
    return newProduct
  }, {})
}

function handleFilter (event) {
  const headerCell = event.target
  const header = headerCell.querySelector('a').dataset.field
  state.filters[header].active = !state.filters[header].active
  if (state.filters[header].active) headerCell.classList.add('active-filter')
  if (!state.filters[header].active) headerCell.classList.remove('active-filter')
}

function dateStringForDateInput (dateString) { // formatting for HTML5 date input
  const date = new Date(dateString)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
