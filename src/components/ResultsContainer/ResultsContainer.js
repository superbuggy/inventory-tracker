import React from 'react'
import Result from '../Result/Result'

const ResultsContainer = props => {
  let results = props.products.map((product, index) => (
    <Result
      key={index}
      productName={product['Product Name']}
      country={product['Country']}
      symptoms={product['Symptom']}
      availableInUS={product['US Availability']}
      activeIngredientsEnglish={product['Active Ingredients (EN)']}
      activeIngredientsForeign={product['Active Ingredients (abroad)']}
    />
  ))
  return (
    <div>
      {results}
    </div>
  )
}

export default ResultsContainer
