import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Kraunama...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Klaida pasiekiant API!"));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;