import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
const FoodDisplay = ({category}) => {

const {food_list, search} = useContext(StoreContext)

  const matchesSearch = (item) =>
    !search || item.name.toLowerCase().includes(search.toLowerCase());

  const filteredList = food_list.filter(
    (item) => (category === "All" || category === item.category) && matchesSearch(item)
  );

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
          {filteredList.length > 0
            ? filteredList.map((item, index) => (
                <FoodItem
                    key={index}
                    id={item._id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                />
              ))
            : <p className='food-display-no-results'>No dishes found{search ? ` for "${search}"` : ""}.</p>
          }
        </div>
    </div>
  )
}

export default FoodDisplay