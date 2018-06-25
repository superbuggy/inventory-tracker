import React from 'react'
import './CategoryFilters.css'

const CategoryFilters = props => {
  const categoryButtons = props.categories.map((category, index) => (
    <input
      key={index}
      type={'button'}
      onClick={props.changeCategory}
      className={'category-button'}
      name={category}
      value={category}
    />
  ))
  return (
    <div className={'categories-container'}>
      <input
        type={'button'}
        onClick={props.changeCategory}
        className='category-button'
        name={'All Categories'}
        value={'All Categories'}
      />
      { categoryButtons }
    </div>
  )
}

export default CategoryFilters
