import "./Map.css";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import Filter from "../Components/Filter";
import Favorites from "../Components/Favorites";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  MarkerF,
} from "@react-google-maps/api";

import React, { useState, useEffect, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoIcon from "../Logos/icon.svg";
import mapStyle from "./mapStyle.json"; // assuming the JSON is saved in a separate file
import Cookies from "js-cookie";
import ReactDOMServer from "react-dom/server";
import SongPreview from "../Components/SongPreview";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { SuperClusterAlgorithm } from "@googlemaps/markerclusterer";

function Map() {
  const [libraries] = useState(["places"]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries,
  });

  const autocomplete = useRef(null);
  const navigate = useNavigate();
  const popupRefFilter = useRef(null);
  const popupRefFavorites = useRef(null);
  const [center, setCenter] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [placeIds, setPlaceIds] = useState([]);
  const [filters, setFilters] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [error, setError] = useState("");
  const [markers, setMarkers] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/map/updateLocations`)
  //     .then((result) => {
  //       console.log(result.data);
  //     });
  // }, []);

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
      const token = Cookies.get("jwt");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/refresh`,
        config
      );
      //console.log("spotify access refreshed");
    };
    fetchData();
  }, []);

  const handleMapLoad = (map) => {
    setMapRef(map);
    //console.log(mapRef);
  };

  //get bounds of the map
  useEffect(() => {
    if (mapRef) {
      mapRef.addListener("idle", () => {
        const bound = mapRef.getBounds();
        setBounds(bound);
      });
    }
  }, [mapRef]);

  //set current location as center
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
    if (mapRef && bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      axios
        .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/map`, {
          params: {
            bounds: `${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}`,
          },
        })
        .then((result) => {
          const posts = result.data.posts;
          //console.log(result.data);
          const newMarkers = posts
            .filter((post) => {
              return (
                markers.findIndex(
                  (marker) => marker.key === post.locationName.placeId
                ) === -1
              );
            })
            .map((post) => createSongMarkers(post));
          // const cluster = new MarkerClusterer({
          //   markers,
          //   mapRef,
          //   algorithm: new SuperClusterAlgorithm({ radius: 200 }),
          // });
          // console.log(cluster);
          // Initialize the MarkerClusterer with the markers and mapRef
          setMarkers([...markers, ...newMarkers]);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [bounds, mapRef]);

  function createSongMarkers(post) {
    if (
      post.locationName &&
      post.locationName.geo &&
      post.locationName.geo.location
    ) {
      const marker = new window.google.maps.Marker({
        key: post.locationName.placeId,
        position: {
          lat: post.locationName.geo.location.lat,
          lng: post.locationName.geo.location.lng,
        },
        title: post.locationName.name,
        icon: {
          url: logoIcon,
          scaledSize: new window.google.maps.Size(30, 30),
        },
        clickable: true,
      });

      const infoWindowContent = `
      <div class="infowindow-container">
        ${ReactDOMServer.renderToString(<SongPreview track={post.songTitle} />)}
      </div>
    `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
        disableAutoPan: true,
      });

      let isInfoWindowVisible = false;

      window.google.maps.event.addListener(mapRef, "zoom_changed", () => {
        //console.log(mapRef.getZoom());
        if (mapRef.getZoom() >= 14 && !isInfoWindowVisible) {
          infoWindow.open(mapRef, marker);
          isInfoWindowVisible = true;
        } else if (mapRef.getZoom() < 14 && isInfoWindowVisible) {
          infoWindow.close();
          isInfoWindowVisible = false;
        }
      });
      marker.addListener("click", () => {
        //console.log("marker place id: " + marker.key);
        handleCustomMarkerClick(marker.key);
      });
      marker.setMap(mapRef);
      return marker;
    }
  }

  //handle filter pop up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRefFilter.current &&
        !popupRefFilter.current.contains(event.target)
      ) {
        setShowFilterPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRefFilter]);

  //handle filter pop up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRefFavorites.current &&
        !popupRefFavorites.current.contains(event.target)
      ) {
        setShowFavoritesPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRefFavorites]);

  //handle search bar
  const onPlaceChanged = () => {
    if (autocomplete.current !== null) {
      setCenter({
        lat: autocomplete.current.getPlace().geometry.location.lat(),
        lng: autocomplete.current.getPlace().geometry.location.lng(),
      });
    }
  };

  //handle google map marker
  const handleMarkerClick = (event) => {
    const marker = event?.placeId;
    if (marker) {
      //console.log(marker);
      // This is a Google Place marker, redirect to user profile page
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
        (results, status) => {
          if (status === "OK") {
            //console.log(results[0].place_id);
            const locationID = results[0].place_id;
            navigate(`/LocationProfile/${locationID}`);
          } else {
            console.log(
              "Geocode was not successful for the following reason: " + status
            );
          }
        }
      );
    }
  };

  //handle custom marker click
  const handleCustomMarkerClick = (locationID) => {
    //console.log(locationID);
    navigate(`/LocationProfile/${locationID}`);
  };

  function handleFilterClick() {
    setShowFilterPopup(!showFilterPopup);
  }

  function handleFavoritesClick() {
    setShowFavoritesPopup(!showFavoritesPopup);
  }

  //filter locations
  const filterLocations = (filters) => {
    setFilters(filters);
    //console.log(filters);

    const service = new window.google.maps.places.PlacesService(mapRef);
    const request = {
      location: center,
      bound: bounds,
      radius: "500",
      types: filters,
    };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const result = results.map((result) => result);
        const placeIds = results.map((result) => result.place_id);
        setPlaceIds(placeIds);
        createMarkers(results);
        //console.log(result);
      }
    });
  };

  //create marker based on filter
  function createMarkers(locations) {
    //console.log("creating markers");
    if (locations) {
      //console.log("filtered");
      const markers = locations.map((place) => {
        //console.log(place.place_id);
        const marker = new window.google.maps.Marker({
          key: place.place_id,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          clickable: true,
        });
        marker.addListener("click", () => {
          //console.log("marker place id: " + marker.key);
          handleCustomMarkerClick(marker.key);
        });
        return marker;
      });
      markers.forEach((m) => m.setMap(mapRef));
      //console.log(markers);
    } else {
      //console.log("filters null");
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
          <div onClick={handleFilterClick}>Filter</div>
          {showFilterPopup && (
            <div className="popup" ref={popupRefFilter}>
              <div className="popup-inner">
                <Filter
                  filterLocations={filterLocations}
                  handleClick={handleFilterClick}
                />
              </div>
            </div>
          )}
        </div>
        <div className="favorites">
          <div onClick={handleFavoritesClick}>Favorites</div>
          {showFavoritesPopup && (
            <div className="popup" ref={popupRefFavorites}>
              <div className="popup-inner">
                <Favorites />
              </div>
            </div>
          )}
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
            styles: mapStyle,
            mapTypeControl: false,
          }}
          onClick={handleMarkerClick}
        >
          <MarkerF position={center} />
        </GoogleMap>
      )}
    </div>
  );
}

export default Map;
