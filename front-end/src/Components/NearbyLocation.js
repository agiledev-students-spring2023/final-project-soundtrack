import { useLoadScript, GoogleMap, Marker,MarkerF } from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NearbyLocation.css";

function NearbyLocation(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U",
    libraries: ["places"],
  });

  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);



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

  const handleMarkerClick = (event) => {
    setSelectedLocation(event.latLng);
    setConfirm(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
  { location: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
  (results, status) => {
    if (status === "OK") {
      setLocationName(results[0].formatted_address);
    } else {
      console.error(status);
    }
  }
);
  };



  function handleClick() {
    const value = 'false';
    props.onValueFromChild(value);
  }

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  return (
    <div className="map-container">
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
        >
          <MarkerF position={center} />
        </GoogleMap>
      )}
      {locationName && (
  <div className="location-name">{locationName}</div>
)}
      <div>
        {confirm && (
          <button className="confirmButton" onClick={handleClick} >
            I am here!
          </button>
        )}
      </div>
    </div>
  );
}

export default NearbyLocation;