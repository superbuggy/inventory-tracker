import React from 'react'
import DropDown from '../DropDown/DropDown'
import './SearchBar.css'

const SearchBar = props => {
  return (
    <div className={'search-container'}>
      <h1>Search {props.headerText}</h1>
      <p>Enter an active ingredient in your desired language, or search by Product Name (English).</p>
      <input
        type={'text'}
        placeholder={'Search by active ingredient or product'}
        onChange={props.handleSearch}
      />
      <DropDown changeCountry={props.changeCountry} countries={props.countries} />
      <button onClick={props.resetFilters}>Clear Filters</button>
    </div>
  )
}

export default SearchBar