import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};
// eslint-disable-next-line no-unused-vars
const MapWrapper = ({ city, date, bags }) => {
  const [center, setCenter] = useState({ lat: 54.6872, lng: 25.2797 }); // Default to Vilnius
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [domReady, setDomReady] = useState(false);


  useEffect(() => {
    setDomReady(true);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/locations?city=${city}&bags=${bags}`);
        const data = await res.json();
        const validLocs = data.filter(loc => !isNaN(loc.lat) && !isNaN(loc.lng));
        setLocations(validLocs);

        if (validLocs.length > 0) {
          setCenter({ lat: parseFloat(validLocs[0].lat), lng: parseFloat(validLocs[0].lng) });
        } else if (city) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: city }, (results, status) => {
            if (status === "OK" && results[0]) {
              setCenter({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
              });
            } else {
              setCenter({ lat: 54.6872, lng: 25.2797 }); // fallback to Vilnius
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };

    if (city && bags) {
      fetchLocations();
    }
  }, [city, bags]);

  const isValidCoord = (lat, lng) =>
    !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));

  if (!domReady) return null;

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={() => setMapLoaded(true)}
      >
        {mapLoaded &&
          locations
            .filter((loc) => isValidCoord(loc.lat, loc.lng))
            .map((loc) => (
              <Marker
                key={loc.id}
                position={{
                  lat: parseFloat(loc.lat),
                  lng: parseFloat(loc.lng),
                }}
                onClick={() => setSelectedMarker(loc)}
              />
            ))}

        {mapLoaded &&
          selectedMarker &&
          isValidCoord(selectedMarker.lat, selectedMarker.lng) && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedMarker.lat),
            lng: parseFloat(selectedMarker.lng),
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ width: "200px" }}>
            <img
              src="/location.png"
              alt="Location header"
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            />
            <h4>{selectedMarker.name}</h4>
            <p>📍 {selectedMarker.address}</p>
            <p>⏰ {selectedMarker.open_hours?.from}-{selectedMarker.open_hours?.to}</p>
            <p>🧳 Up to {selectedMarker.max_bags} bags</p>
            <p>💰 {parseFloat(selectedMarker.hourly_rate).toFixed(2)} €/hour</p>
            <a href={`/location/${selectedMarker.id}`}>More info</a>
          </div>
        </InfoWindow>
          )}
      </GoogleMap>
    </div>
  );
};

export default MapWrapper;
