import React from 'react'

const SearchBar = props => {
  return (
    <div>
      <h1>Search All Products</h1>
      <p>Enter an active ingredient in your desired language, or search by product name.</p>
      <input type="text" onChange={props.handleSearch} />
    </div>
  )
}

export default SearchBar