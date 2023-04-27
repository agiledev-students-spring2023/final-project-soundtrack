import React from "react";
import "./Filter.css";

function Filter(props) {
    const locationFilters = [
        "airport", 
        "amusement_park", 
        "aquarium", 
        "art_gallery", 
        "bakery", 
        "bar", 
        "book_store", 
        "cafe", 
        "church", 
        "clothing_store", 
        "gym", 
        "library", 
        "museum", 
        "night_club", 
        "park", 
        "restaurant", 
        "school", 
        "shopping_mall", 
        "subway_station", 
        "tourist_attraction", 
        "train_station", 
        "university", 
        "zoo"
    ];

    const [checkboxes, setCheckboxes] = React.useState(
        Array(locationFilters.length).fill(false)
    );

    const handleCheckboxChange = (index) => {
        const newCheckboxes = [...checkboxes];
        newCheckboxes[index] = !newCheckboxes[index];
        setCheckboxes(newCheckboxes);
    };
    
    
    const applyFilters = () => {
        const selectedFilters = checkboxes
          .map((isChecked, index) => isChecked ? locationFilters[index] : null)
          .filter(Boolean);
        props.filterLocations(selectedFilters);
        props.handleClick();
    };

    return (
        <div className="FilterContainer"> 
            <div className="Title">Filter</div>

            {
            // <label>
            //     <input type="checkbox" checked={checked} onChange={handleChange} className="filter" id="Favorites"/>
            //     Favorites
            // </label>
            }

            <ul>
                {
                    locationFilters.map((location, index) => (
                        <label key={location}>
                          <input
                            type="checkbox"
                            checked={checkboxes[index]}
                            onChange={() => handleCheckboxChange(index)}
                            className="Filter"
                            id={location}
                          />
                          {location}
                        </label>
                      ))
                }
            </ul>
            
            <button onClick={applyFilters}>Confirm</button>
        </div>
    );
}

export default Filter;
