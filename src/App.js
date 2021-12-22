import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import Add from "./Pages/Add";
import NavBar from "./components/NavBar";
function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Add />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
