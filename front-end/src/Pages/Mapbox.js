import React, { useState, useEffect, useRef } from 'react';
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import { useNavigate } from "react-router-dom";
import Filter from "../Components/Filter";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGl5YWpvbGllIiwiYSI6ImNsZ3BqNmZoajBodjMzZmtibTQ5azdoOTEifQ.Rk9743jXcNV6k3tVuLVY4A';

function Mapbox() {
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [zoom, setZoom] = useState(null);

    const mapContainer = useRef(null);
    const map = useRef(null);

    const navigate = useNavigate();
    const popupRef = useRef(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            setLng(position.coords.longitude);
            setLat(position.coords.latitude);
            setZoom(15);
        });
        }
    }, []);

    useEffect(() => {
        if (map.current) {
            map.current.flyTo({ center: [lng, lat], zoom: zoom });
        }
        else {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef]);

    function handleClick() {
        setShowPopup(!showPopup);
    }

    const filterLocations = (filters) => {
        console.log(filters);
    };

    return (
        <div>
            <div className="header">
                <HeaderBrowseMap />
            </div>
            <div className="buttonContainer">
                <div className="filter">
                    <div onClick={handleClick}>Filter</div>
                    {showPopup && (
                        <div className="popup" ref={popupRef}>
                            <div className="popup-inner">
                                <Filter
                                    filterLocations={filterLocations}
                                    handleClick={handleClick}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="favorites"
                    onClick={() => {
                        navigate("/Favorites");
                    }}
                >
                    Favorites
                </div>
            </div>
            <div ref={mapContainer} style={{height: '400px'}} />
        </div>
    );
}

export default Mapbox;
