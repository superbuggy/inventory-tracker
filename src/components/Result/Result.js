import React from 'react'
import './Result.css'

const Result = ({
  englishProductName,
  foreignProductName,
  country,
  symptoms,
  availableInUS,
  activeIngredientsEnglish,
  activeIngredientsForeign
}) => {
  const availability = availableInUS.toLowerCase().includes('y')
    ? <p className={'availability'}>
        Available in the US as <br /><strong>{englishProductName}</strong>
      </p>
    : <p className={'availability'}>
        <i><strong>Unavailable in the US</strong>
      </i></p>

  return (
    <div className={'result'}>
      <h3>{foreignProductName}</h3>
      {availability}
      <h4>Used to treat</h4>
      <p>{symptoms}</p>
      <h4>Active Ingredients</h4>
      <div className={'ingredients'}>
        <p className={'active-ingredient'}>{activeIngredientsEnglish}</p>
        <p className={'active-ingredient'}>{activeIngredientsForeign}</p>
      </div>
    </div>
  )
}

export default Result
