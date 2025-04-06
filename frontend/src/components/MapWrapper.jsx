import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const MapWrapper = () => {
  const center = { lat: 54.6872, lng: 25.2797 };
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
        const res = await fetch("http://127.0.0.1:8000/api/locations?city=Vilnius&bags=1");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };

    fetchLocations();
  }, []);

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
                <h4>{selectedMarker.name}</h4>
                <p>📍 {selectedMarker.address}</p>
                <p>
                  ⏰ {selectedMarker.open_hours?.from}–{selectedMarker.open_hours?.to}
                </p>
                <p>🧳 Up to {selectedMarker.max_bags} bags</p>
                <a href={`/location/${selectedMarker.id}`}>More info</a>
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </div>
  );
};

export default MapWrapper;
