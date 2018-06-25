import React from 'react'
import './DropDown.css'

const DropDown = props => {
  const options = props.countries.map((country, index) => (
    <option key={index} value={country}> {country} </option>
  ))

  return (
    <select onChange={props.changeCountry}>
      <option key={0} value={'All Countries'}> { 'All Countries' } </option>
      { options }
    </select>
  )
}

export default DropDown