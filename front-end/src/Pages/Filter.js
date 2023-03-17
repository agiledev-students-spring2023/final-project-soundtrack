import './Filter.css';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';

function Filter() {
    return (
        <header>
            <HeaderBrowseMap/>

            <div className="Title">
                Filter
            </div>

            <div className="Button">
                <button>
                Clear Filters
                </button>
            </div>

            <div className="Filter">
                <input type="checkbox"/>
                <label>Favorites</label>
            </div>
            <div className="Filter">
                <input type="checkbox"/>
                <label>Cafes</label>
            </div>
            <div className="Filter">
                <input type="checkbox"/>
                <label>Museums</label>
            </div>
            <div className="Filter">
                <input type="checkbox"/>
                <label>Parks</label>
            </div>
        </header>
    );
}

export default Filter;