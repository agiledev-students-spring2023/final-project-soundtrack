import "./Filter.css";
import {useNavigate} from "react-router-dom"


function Filter() {
    const navigate = useNavigate(); 

  return (
    <div className="FilterContainer">
      <div className="Title">Filter</div>

      <div className="Filter">
        <input type="checkbox" />
        <label>Favorites</label>
      </div>
      <div className="Filter">
        <input type="checkbox" />
        <label>Cafes</label>
      </div>
      <div className="Filter">
        <input type="checkbox" />
        <label>Museums</label>
      </div>
      <div className="Filter">
        <input type="checkbox" />
        <label>Parks</label>
      </div>
      <button className="confirmButton" onClick = {() => {
            navigate("/map")
            }}>confirm</button>
    </div>
  );
}

export default Filter;
