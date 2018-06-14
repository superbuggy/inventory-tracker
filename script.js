const BE_WELL_AWAY_ENDPOINT = 'https://cellmateapp.com/api/gamFYB//BeWellAway'
const DEFAULT_CATEGORY = 'Product Name'

const state = {
  products: [],
  activeCategory: DEFAULT_CATEGORY
}

getProducts().then(data => {
  state.products = data
  drawCategories(data)
  addCountriesToDropDown(data)
})

const searchBar = document.querySelector('input.search')
const searchForm = document.querySelector('form.search')
const categoriesSection = document.querySelector('div.categories')

searchBar.addEventListener('input', toggleCategoriesVisibility)
searchForm.addEventListener('submit', handleSearch)

const FIELDS = [ // These must match spreadsheet headers
  'Category',
  'Country',
  'Product Name',
  'Symptom',
  'US Availability',
  'Active Ingredients(EN)',
  'Active Ingredients(abroad)'
]

function getProducts () {
  return fetch(BE_WELL_AWAY_ENDPOINT)
    .then(stream => stream.json())
}

function toggleCategoriesVisibility (event) {
  if (event.target.value) {
    categoriesSection.style.opacity = 0
  } else {
    categoriesSection.style.opacity = 1
  }
}

function handleSearch (event) {
  event.preventDefault()
  console.log('Form submitted')
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
  console.log(state.activeCategory)
}

function addCountriesToDropDown (products) {
  const countries = Array.from(new Set(products.map(product => product.Country)))
  countries.forEach(country => addCountryToDropDown(country))
}

function addCountryToDropDown (country) {
  const dropDownMenu = document.querySelector('select[name^=country]')
  const newOption = document.createElement('option')
  newOption.value = country
  newOption.innerText = country
  dropDownMenu.appendChild(newOption)
}
