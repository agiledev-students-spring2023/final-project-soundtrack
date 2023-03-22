import './Map.css';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useState, useEffect } from 'react';

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U",
    libraries: ["places"],
  });

  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);

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

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const mapContainerStyle = {
    width: "100%",
    height: "600px"
  };
  console.log({center});
  
  return (
    <div>
      <HeaderBrowseMap />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
        >
         <MarkerF position={center}/>
     </GoogleMap>
      )}
    </div>
  );
}

export default Map;
