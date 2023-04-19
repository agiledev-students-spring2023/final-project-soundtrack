import "./Map.css";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
// import usePlacesAutocomplete from "use-places-autocomplete";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "../Components/Filter";
// import Favorites from './Favorites'
import axios from "axios";

function Map() {
  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U",
    libraries,
  });

  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const autocomplete = useRef(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState([]);
  const popupRef = useRef(null);
  const map = useRef(null);
  // const [service, setService] = useState(null); // PREV
  const service = useRef(null);
  const [results, setResults] = useState(null);
  const [refetch, setReFetch] = useState(true);

  // function serviceSetter() {
  //   console.log("serviceSetter running");
  //   return new Promise(() => {
  //     console.log("inside Promise");
  //     setService(new window.google.maps.places.PlacesService(map.current)); // PREV
  //     service.current = new window.google.maps.places.PlacesService(map.current);
  //     console.log("service set");
  //   });
  // };
  
  // const [visibleMarkers, setVisibleMarkers] = useState(0);

  // useEffect(() => {
  //   if (loading) return; // Don't run until we have the user's location
  //   const bounds = map.current.getBounds();
  //   let count = 0;
  
  //   if (map.current) {
  //     console.log("service instantiated in useEffect")
  //   }
  
  //   map
  //     .getMarkers()
  //     .forEach(marker => {
  //       if (bounds.contains(marker.getPosition())) {
  //         console.log(marker.getPosition());
          
  //         count++;
  //       }
  //     });
  //   setVisibleMarkers(count);
  //   console.log("visible marker" + visibleMarkers);
  // }, [map, loading]);
  



  useEffect(() => {
    console.log("in useEffect: " + filters);

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

    // if (window.google) { // PREV
    //   setService(new window.google.maps.places.PlacesService(map.current));
    // }
    if (map.current) {
      console.log("service instantiated in useEffect");
      service.current = new window.google.maps.places.PlacesService(
        map.current
      );
    }
  }, [filters]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (popupRef.current && !popupRef.current.contains(event.target)) {
  //       setShowPopup(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [popupRef]);

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
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
        (results, status) => {
          if (status === "OK") {
            console.log(results[0].formatted_address);
            axios
              .post(
                `${process.env.REACT_APP_SERVER_HOSTNAME}/LocationProfile/savedLocation`,
                { locationName: results[0].formatted_address }
              )
              .then((result) => {
                console.log("success sent locaiton name");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.error(status);
          }
        }
      );
      navigate("/LocationProfile");
    }
  };

  function handleClick() {
    setShowPopup(!showPopup);
  }

  const filterLocations = useCallback((filters) => {
    setFilters(filters);

    const request = {
      location: center,
      radius: 4000,
      type: filters,
    };

    function callback(searchResults, status) {
      console.log("callback");
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setResults(searchResults);
        createMarkers(results);
      }
    }

    // if (service) { // PREV
    //   console.log("service not null");
    //   service.nearbySearch(request, callback);
    // } else {
    //   console.log("service is null");
    //   await serviceSetter();
    //   console.log("await done");
    //   service.nearbySearch(request, callback);
    //   console.log("nearbySearch called");
    // }

    service.current = new window.google.maps.places.PlacesService(map.current);
    service.current.nearbySearch(request, callback);
    console.log("nearbySearch called");
    setReFetch(!refetch);
  });


  function createMarkers(locations) {
    console.log("creating markers");
    if (locations) {
      console.log("filtered");
      const markers = locations.map((place) => {
        return (
          <MarkerF
            key={place.id}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
          />
        );
      });
      markers.forEach((m) => m.setMap(map));
    } else {
      console.log("filters null");
    }
  }

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
