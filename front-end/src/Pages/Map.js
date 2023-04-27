import "./Map.css";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import Filter from "../Components/Filter";
import Cookies from "js-cookie";

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
import axios from "axios";

const map_key = process.env.REACT_APP_MAP_KEY; 
console.log(map_key); 

//const map_key = "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U"; 

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: map_key,
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

    // client credentials flow
    const [token, setToken] = useState(null);
    useEffect(() => {
      const fetchToken = async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/client`
        );
        //console.log(response);
        setToken(response.data);
      };
      fetchToken();
    }, []);


    useEffect(() => {
      const fetchData = async () => {
        const token = Cookies.get('jwt');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/refresh`, config);      
        console.log("spotify access refreshed"); 
      };
      fetchData();
    }, []);

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

  const handleMapLoad = (map) => {
    setMapRef(map);
    console.log(mapRef);
    console.log(map.getBounds());
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
      console.log(marker);
      // This is a Google Place marker, redirect to user profile page
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
        (results, status) => {
          if (status === "OK") {
            console.log(results);
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
          createMarkers(results);
          console.log(result);
        }
      });
  };

  function createMarkers(locations) {
    console.log("creating markers");
    if (locations) {
      console.log("filtered");
      const markers = locations.map((place) => {
        return (
          new window.google.maps.Marker({
            key: place.id,
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          })
        );
      });
      markers.forEach((m) => m.setMap(mapRef));
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
