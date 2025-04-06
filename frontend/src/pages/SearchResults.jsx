import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MapWrapper from "../components/MapWrapper";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { t } = useTranslation();

  const city = queryParams.get("city");
  const date = queryParams.get("date");
  const bags = queryParams.get("bags");

  return (
    <div>
      <h2 className="search-heading">
        {t("search_results_for", { city, date, bags })}
      </h2>
      <MapWrapper />
    </div>
  );
};

export default SearchResults;
