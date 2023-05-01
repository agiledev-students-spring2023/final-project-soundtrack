import {
  useLoadScript,
  GoogleMap,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import "./NearbyLocation.css";

const libraries = ["places"];

function NearbyLocation({ onNext }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries,
  });

  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  const handleMapLoad = (map) => {
    setMapRef(map);
    console.log(mapRef);
  };

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
          if (results[0]) {
            const placeId = results[0].place_id;
            const service = new window.google.maps.places.PlacesService(mapRef);
            service.getDetails(
              {
                placeId,
                fields: ["name"],
              },
              (place, status) => {
                if (status === "OK" && place) {
                  const locationProfile ={
                    name: place.name,
                    formatted_address: results[0].formatted_address,
                    geo: results[0].geometry,
                    placeId: placeId
                  }
                  setLocationName(locationProfile);
                  console.log(locationProfile);
                  console.log(locationName);

                  
                } else {
                  console.log("No results found");
                }
              }
            );
          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      }
    );
  };
  
  const handleNext = () => {
    if (locationName) {
      onNext(locationName);
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const mapContainerStyle = {
    width: "100%",
    height: "550px",
  };

  return (
    <div className="map-container">
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
          <MarkerF position={center} />
        </GoogleMap>
      )}
      {locationName && (
        <div className = "location-container">
        <div className="location-name">{locationName.name}</div>
        <div className="location-address">{locationName.formatted_address}</div>
        </div>
      )}
      <div>
        {confirm && (
          <button className="confirmButton" onClick={handleNext}>
            I am here!
          </button>
        )}
      </div>
    </div>
  );
}

export default NearbyLocation;
