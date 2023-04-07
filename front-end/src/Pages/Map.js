import "./Map.css";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import { useLoadScript, GoogleMap, Marker, MarkerF, Autocomplete} from "@react-google-maps/api";
// import usePlacesAutocomplete from "use-places-autocomplete";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "../Components/Filter";
// import Favorites from './Favorites'

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U",
    libraries: ["places"],
  });

  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const autocomplete = useRef(null);
  const navigate = useNavigate(); 
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const map = useRef(null);
  const [service, setService] = useState(null);
  const [results, setResults] = useState(null);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    if (window.google) {
      setService(new window.google.maps.places.PlacesService(map.current));
    }
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete.current !== null) {
      setCenter({
        lat: autocomplete.current.getPlace().geometry.location.lat(),
        lng: autocomplete.current.getPlace().geometry.location.lng(),
      });
    }
  };

  const handleMarkerClick = (event) => {
    const marker = event?.placeId;
    if (marker) {
      console.log(marker);
      // This is a Google Place marker, redirect to user profile page
      navigate("/LocationProfile");
    }
  };

  function handleClick() {
    setShowPopup(true)
  }

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

  function filterLocations(filters) {
    // filters.forEach(x => console.log(x));

    const request = {
      location: center,
      radius: 4000,
      type: filters
    };

    function callback(searchResults, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setResults(searchResults);
      }
    }

    if (service) {
      service.nearbySearch(request, callback);
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          setService(new window.google.maps.places.PlacesService(map.current));
          clearInterval(interval);
        }
      }, 100);
    }
  };

  function createMarkers(locations) {
    if (locations) {
      console.log("filtered");
      return locations.map((place) => {
        return (
          <MarkerF
            key={place.id}
            position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
          />
        );
      });
    } else {
      console.log("null");
      return (<MarkerF position={center} onClick={() => navigate("/LocationProfile")} />);
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  return (
    <div className="map-container">
      <div className="header">
        <HeaderBrowseMap />
      </div>
      <div className="autocomplete-container">
        <Autocomplete    
          onLoad={(auto) => (autocomplete.current = auto)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            className="autocomplete-input"
            type="text"
            placeholder="Enter a location"
          />
        </Autocomplete>
      </div>
      <div className = "buttonContainer">
        <div className='filter' onClick = {handleClick}>
          Filter
          {showPopup && (
            <div className="popup" ref={popupRef}>
              <div className="popup-inner">
                <Filter filterLocations={filterLocations}/>
              </div>
            </div>
          )} 
        </div>
        <div className='favorites' onClick = {() => {
            navigate("/Favorites")
            }}>
          Favorites  
        </div>
      </div>
    
      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={{
            mapTypeControl: false,
          }}
          onClick={handleMarkerClick} 
          ref={map} // pass the ref to the GoogleMap component
        >
          
          {createMarkers(results)}
        </GoogleMap>
  
      )}
    </div>
  );
}

export default Map;
