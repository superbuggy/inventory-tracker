import React from 'react'
import Result from '../Result/Result'
import './ResultsContainer.css'

const ResultsContainer = props => {
  let results = props.products.map((product, index) => (
    <Result
      key={index}
      englishProductName={product['Product Name (English)']}
      foreignProductName={product['Product Name (abroad)']}
      country={product['Country']}
      symptoms={product['Symptom']}
      availableInUS={product['US Availability']}
      activeIngredientsEnglish={product['Active Ingredients (English)']}
      activeIngredientsForeign={product['Active Ingredients (abroad)']}
    />
  ))
  return (
    <div className={'results-container'}>
      {results}
    </div>
  )
}

export default ResultsContainer
