import React, { useState } from "react";

function LandingPage({ language }) {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [bags, setBags] = useState(1);

  const t = {
    en: {
      title: "Welcome to BagStorage!",
      subtitle: "Find a nearby place for temporary luggage storage.",
      city: "City",
      date: "Date",
      bags: "Number of Bags",
      search: "Search",
    },
    lt: {
      title: "Sveiki atvykę į BagStorage!",
      subtitle: "Raskite artimiausią vietą laikinam bagažo saugojimui.",
      city: "Miestas",
      date: "Data",
      bags: "Bagažo kiekis",
      search: "Ieškoti",
    },
  };

  return (
    <section className="landing-wrapper">
      <h1 className="landing-title">{t[language].title}</h1>
      <p className="landing-subtitle">{t[language].subtitle}</p>
      <div className="search-panel">
        <input
          type="text"
          placeholder={t[language].city}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <input
          type="number"
          min="1"
          value={bags}
          onChange={(e) => setBags(e.target.value)}
          className="input"
        />
        <button className="btn btn-search">{t[language].search}</button>
      </div>
    </section>
  );
}

export default LandingPage;
