import React, { Component } from 'react'
import axios from 'axios'
import './BeWellAway.css'
import SearchBar from '../SearchBar/SearchBar'
import CategoryFilters from '../CategoryFilters/CategoryFilters'
import ResultsContainer from '../ResultsContainer/ResultsContainer'
import DropDown from '../DropDown/DropDown'
import { BE_WELL_AWAY_API } from '../../constants'

class BeWellAway extends Component {
  constructor () {
    super()
    this.state = this.initialState()

    this.initializeState = this.initializeState.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.changeCountry = this.changeCountry.bind(this)
    this.changeCategory = this.changeCategory.bind(this)
  }

  initialState () {
    return {
      products: [],
      filteredProducts: [],
      searchTerm: '',
      activeCategory: 'All Categories',
      activeCountry: 'All Countries'
    }
  }

  initializeState () {
    this.setState(
      prevState => {
        const products = prevState.products
        console.log(products)
        return {
          ...this.initialState(),
          products,
          filteredProducts: products
        }
      },
      this.applyFilters
    )
  }

  getCountries () {
    return this.state.products.map(product => product['Country'])
  }

  getCategories () {
    const categories = this.state.products.map(product => product['Category'])
    return Array.from(new Set(categories))
  }

  doesProductIncludeSearchTerm (product, searchTerm) {
    console.log(!!this.state.searchTerm)
    if (!this.state.searchTerm) return true
    return product['Product Name'].toLowerCase().includes(searchTerm.toLowerCase())
      || product['Active Ingredients (EN)'].toLowerCase().includes(searchTerm.toLowerCase())
      || product['Active Ingredients (abroad)'].toLowerCase().includes(searchTerm.toLowerCase())
  }

  isProductInCountry (product, country) {
    return this.state.activeCountry === 'All Countries'
      ? true
      : product['Country'] === country
  }

  doesProductBelongToActiveCategory (product, category) {
    return this.state.activeCategory === 'All Categories'
      ? true
      : product['Category'] === category
  }

  applyFilters () {
    const filteredProducts = this.state.products.filter(product => {
      return this.isProductInCountry(product, this.state.activeCountry)
        && this.doesProductBelongToActiveCategory(product, this.state.activeCategory)
        && this.doesProductIncludeSearchTerm(product, this.state.searchTerm)
    })

    this.setState(prevState => ({
      ...prevState,
      filteredProducts
    }))
  }

  handleSearch (event) {
    event.persist()
    this.setState(
      prevState => ({ ...prevState, searchTerm: event.target.value }),
      _ => this.applyFilters()
    )
  }

  changeCountry (event) {
    event.persist()
    this.setState(
      prevState => ({ ...prevState, activeCountry: event.target.value }),
      _ => this.applyFilters()
    )
  }

  changeCategory (event) {
    console.log(event.target.value)
    event.persist()
    this.setState(
      prevState => ({ ...prevState, activeCategory: event.target.value }),
      _ => this.applyFilters()
    )
  }

  componentDidMount () {
    axios.get(BE_WELL_AWAY_API)
      .then(({data: products}) => {
        this.setState(prevState => ({
          ...prevState,
          products,
          filteredProducts: products
        }))
      })
  }

  render () {
    const countries = this.getCountries()
    const categories = this.getCategories()
    const results = this.state.filteredProducts.length
    const productsText = results.length === 1
      ? 'product'
      : 'products'
    const categoryText = this.state.activeCategory === 'All Categories'
      ? ''
      : this.state.activeCategory
    const countryText = this.state.activeCountry === 'All Countries'
      ? 'all countries'
      : this.state.activeCountry
    return (
      <div>
        <SearchBar handleSearch={this.handleSearch} />
        <DropDown changeCountry={this.changeCountry} countries={countries} />
        <p> { `${results} ${categoryText} ${productsText} in ${countryText}` } </p>
        <CategoryFilters changeCategory={this.changeCategory} categories={categories} />
        <button onClick={this.initializeState}>x</button>
        <ResultsContainer products={this.state.filteredProducts} />
      </div>
    )
  }
}

export default BeWellAway
