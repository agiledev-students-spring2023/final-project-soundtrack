import './Map.css';
import {
  useLoadScript, GoogleMap, MarkerF,
  Autocomplete,
} from '@react-google-maps/api';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U',
    libraries: ['places'],
  });

  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const autocomplete = useRef(null);
  const navigate = useNavigate();

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
      },
    );
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
      navigate('/LocationProfile');
    }
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
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
        <div
          className="filter"
          onClick={() => {
            navigate('/Filter');
          }}
        >
          Filter
        </div>
        <div
          className="favorites"
          onClick={() => {
            navigate('/Favorites');
          }}
        >
          Favorite
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
        >
          <MarkerF position={center} onClick={() => navigate('/LocationProfile')} />
        </GoogleMap>

      )}
    </div>
  );
}

export default Map;
