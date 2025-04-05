import React from "react";
import { useLocation } from "react-router-dom";
import MapWrapper from "../components/MapWrapper";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const city = queryParams.get("city");
  const date = queryParams.get("date");
  const bags = queryParams.get("bags");

  return (
    <div>
      <h2>Search Results for: {city}, {date}, {bags} bags</h2>
      <MapWrapper />
    </div>
  );
};

export default SearchResults;
