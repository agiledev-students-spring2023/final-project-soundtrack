import './Map.css';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useState, useEffect,useRef } from 'react';
import { Autocomplete } from "@react-google-maps/api";

function Map() {
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U",
      libraries: ["places"],
    });
  
    const [center, setCenter] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(true);
    const autocomplete = useRef(null);
  
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        error => {
          console.error(error);
          setLoading(false);
        }
      );
    }, []);
  
    const onPlaceChanged = () => {
      if (autocomplete.current !== null) {
        setCenter({
          lat: autocomplete.current.getPlace().geometry.location.lat(),
          lng: autocomplete.current.getPlace().geometry.location.lng()
        });
      }
    };
  
    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";
  
    const mapContainerStyle = {
      width: "100%",
      height: "600px"
    };
  
    return (
      <div>
        <HeaderBrowseMap />
        <div style={{ width: "100%", height: "60px", padding: "10px" }}>
          <Autocomplete
            onLoad={auto => {
              console.log("autocomplete: ", auto);
              autocomplete.current = auto;
              auto.setFields(["address_components", "geometry", "name"]);
            }}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Enter a location"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "50%",
                marginLeft: "-120px"
              }}
            />
          </Autocomplete>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            <MarkerF position={center} />
          </GoogleMap>
        )}
      </div>
    );
  }
  
  export default Map;
  
