const BE_WELL_AWAY_ENDPOINT = 'https://cellmateapp.com/api/gamFYB//BeWellAway'
const DEFAULT_CATEGORY = 'Product Name'

const state = {
  products: [],
  activeCategory: DEFAULT_CATEGORY,
  filterByCountry: null,
  filteredProducts: []
}

getProducts().then(data => {
  state.products = data
  drawCategories(data)
  addCountriesToDropDown(data)
  drawResults(data)
})

const searchBar = document.querySelector('input.search')
const searchForm = document.querySelector('form.search')
const categoriesSection = document.querySelector('div.categories')
const resultsContainer = document.querySelector('.results')
const dropDownMenu = document.querySelector('select[name^=country]')

dropDownMenu.addEventListener('change', filterByCountry)
searchBar.addEventListener('input', handleSearch)
// searchForm.addEventListener('submit', handleSearch)

const FIELDS = [ // These must exactly match spreadsheet headers
  'Category',
  'Country',
  'Product Name',
  'Symptom',
  'US Availability',
  'Active Ingredients (EN)',
  'Active Ingredients (abroad)'
]

function getProducts () {
  return fetch(BE_WELL_AWAY_ENDPOINT)
    .then(stream => stream.json())
}

function toggleCategoriesVisibility (event) {
  if (event.target.value) {
    categoriesSection.style.opacity = 0
    resultsContainer.style.opacity = 1
  } else {
    categoriesSection.style.opacity = 1
    resultsContainer.style.opacity = 0
  }
}

function handleSearch (event) {
  toggleCategoriesVisibility(event)
  const searchTerm = event.target.value.toLowerCase()
  const productsFilteredBySearchTerm = state.products.filter(product => product[state.activeCategory].toLowerCase().includes(searchTerm))
  drawResults(productsFilteredBySearchTerm)
}

function drawCategories (products) {
  const categories = Array.from(new Set(products.map(product => product.Category)))
  categories.forEach(category => drawCategory(category))
}

function drawCategory (category) {
  const newCategory = document.createElement('div')
  newCategory.addEventListener('click', toggleActiveCategory)
  newCategory.classList.add('category')
  const header = document.createElement('h3')
  header.innerText = category
  newCategory.appendChild(header)
  categoriesSection.appendChild(newCategory)
}

function toggleActiveCategory (event) {
  let categoryButton = event.target.tagName === 'DIV' ? event.target : event.target.parentNode
  if (Array.from(categoryButton.classList).includes('active')) {
    categoryButton.classList.remove('active')
    state.activeCategory = DEFAULT_CATEGORY
  } else {
    const categoryButtons = document.querySelectorAll('div.category')
    state.activeCategory = categoryButton.innerText
    categoryButtons.forEach(categoryButton => categoryButton.classList.remove('active'))
    categoryButton.classList.add('active')
  }
}

function addCountriesToDropDown (products) {
  const countries = Array.from(new Set(products.map(product => product.Country)))
  countries.forEach(country => addCountryToDropDown(country))
}

function addCountryToDropDown (country) {
  const newOption = document.createElement('option')
  newOption.value = country
  newOption.innerText = country
  dropDownMenu.appendChild(newOption)
}

function drawResults (products) {
  resultsContainer.innerHTML = ''
  products.forEach(product => drawResult(product))
}

function drawResult (product) {
  const div = document.createElement('div')
  div.classList.add('result')
  const header = document.createElement('h3')
  header.innerText = product['Product Name']
  const ingredientsParagraph = document.createElement('p')
  ingredientsParagraph.innerText = product['Active Ingredients (EN)']
  const availabilityParagraph = document.createElement('p')
  availabilityParagraph.innerText = product['US Availability']
  const symptomsParagraph = document.createElement('p')
  symptomsParagraph.innerText = product['Symptom']
  div.appendChild(header)
  div.appendChild(ingredientsParagraph)
  div.appendChild(availabilityParagraph)
  div.appendChild(symptomsParagraph)
  resultsContainer.appendChild(div)
}

function filterByCountry (event) {
  state.filterByCountry = event.target.value === 'Choose a country...' ? null : event.target.value
}
