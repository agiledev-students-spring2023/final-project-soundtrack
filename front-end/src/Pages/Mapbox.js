import React, { useState, useEffect, useRef } from 'react';
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import { useNavigate } from "react-router-dom";
import Filter from "../Components/Filter";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


mapboxgl.accessToken = 'pk.eyJ1IjoiZGl5YWpvbGllIiwiYSI6ImNsZ3BqNmZoajBodjMzZmtibTQ5azdoOTEifQ.Rk9743jXcNV6k3tVuLVY4A';

function Mapbox() {
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [zoom, setZoom] = useState(null);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const geocoderRef = useRef(null);
    const marker = useRef(null);

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
            if (!marker.current) {
                marker.current = new mapboxgl.Marker()
                    .setLngLat(map.current.getCenter())
                    .addTo(map.current);
            }
        }
        else {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });
        }

        if (!geocoderRef.current) {
            geocoderRef.current = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
                placeholder: "Search for a location",
            });
            
            map.current.addControl(geocoderRef.current, "top-left");
        }
    });

    // useEffect(() => {
    //     const geocoder = new MapboxGeocoder({
    //         accessToken: mapboxgl.accessToken,
    //         mapboxgl: mapboxgl,
    //         marker: false,
    //         placeholder: "Search for a location",
    //     });

    //     map.current.addControl(geocoder, "top-left");
    // }, [map]);

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
            <div ref={mapContainer} style={{height: '400px'}}></div>
        </div>
    );
}

export default Mapbox;