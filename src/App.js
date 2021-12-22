import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./Pages/Login";
function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
