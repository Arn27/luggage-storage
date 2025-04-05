import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const MapWrapper = () => {
  const center = { lat: 54.6872, lng: 25.2797 };// Vilnius coordinates
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

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

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={{ lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) }}
          onClick={() => setSelectedMarker(loc)}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={{ lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lng) }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ width: "200px" }}>
            <h4>{selectedMarker.name}</h4>
            <p>📍 {selectedMarker.address}</p>
            <p>⏰ {selectedMarker.open_hours.from}–{selectedMarker.open_hours.to}</p>
            <p>🧳 Up to {selectedMarker.max_bags} bags</p>
            <a href={`/location/${selectedMarker.id}`}>More info</a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapWrapper;
