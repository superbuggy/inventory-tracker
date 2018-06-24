import React from 'react'
import './Result.css'

const Result = ({
  productName,
  country,
  symptoms,
  availableInUS,
  activeIngredientsEnglish,
  activeIngredientsForeign
}) => {
  return (
    <div className="result">
      <h3>{productName}</h3>
      <p>{symptoms}</p>
      <p>{availableInUS}</p>
      <p>{activeIngredientsEnglish}</p>
      <p>{activeIngredientsForeign}</p>
    </div>
  )
}

export default Result
