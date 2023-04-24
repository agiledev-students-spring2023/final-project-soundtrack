import "./Map.css";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import Filter from "../Components/Filter";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  MarkerF,
  MarkerClustererF,
} from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

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
  const [mapRef, setMapRef] = useState(null);
  const [placeIds, setPlaceIds] = useState([]);
  const [filters, setFilters] = useState([]);

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
  }, []);

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

  //get map reference
  const handleMapLoad = (map) => {
    setMapRef(map);
    //console.log(map)
    console.log(mapRef);
    console.log(map.getBounds());
    // map.addListener("bounds_changed", () => {
    //   const bounds = map.getBounds();
    //   const service = new window.google.maps.places.PlacesService(map);
    //   const request = {
    //     bounds: bounds,
    //     type: ['restaurant'],
    //   };
    //   service.nearbySearch(request, (results, status) => {
    //     if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //       const result = results.map((result) => result);
    //       const placeIds = results.map((result) => result.place_id);
    //       setPlaceIds(placeIds);
    //       console.log(result);
    //     }
    //   });
    // });
  };

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
      // This is a Google Place marker, redirect to user profile page
      navigate("/LocationProfile");
    }
  };

  function handleClick() {
    setShowPopup(!showPopup);
  }

  const filterLocations = (filters) => {
    setFilters(filters);
    console.log(filters);

    const service = new window.google.maps.places.PlacesService(mapRef);
      const request = {
        location: center,
        radius: 4000,
        types: filters,
      };
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const result = results.map((result) => result);
          const placeIds = results.map((result) => result.place_id);
          setPlaceIds(placeIds);
          console.log(result);
        }
      });
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
        <div
          className="favorites"
          onClick={() => {
            navigate("/Favorites");
          }}
        >
          Favorite
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : (
        <GoogleMap
          onLoad={handleMapLoad}
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={{
            mapTypeControl: false,
          }}
          onClick={handleMarkerClick}
        >
          {placeIds.map((placeId) => (
            <MarkerF
              key={placeId}
              position = {{lat: 43.6532, lng: -79.3832}}
            />
          ))}
          <MarkerF
            position={center}
            onClick={() => navigate("/LocationProfile")}
          />
        </GoogleMap>
      )}
    </div>
  );
}

export default Map;
