import React from "react";
import { useLocation } from "react-router-dom";
import MapWrapper from "../../components/MapWrapper";
import SearchBar from "../../components/SearchBar";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const city = queryParams.get("city");
  const date = queryParams.get("date");
  const bags = Number(queryParams.get("bags"));

  const parsedDate = date ? new Date(date) : null;

  return (
    <div>
      <SearchBar initialCity={city} initialDate={parsedDate} initialBags={bags} compact />
      <MapWrapper city={city} date={date} bags={bags} />
    </div>
  );
};

export default SearchResults;
