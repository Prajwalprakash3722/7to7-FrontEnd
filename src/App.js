import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import Add from "./Pages/Add";
import NavBar from "./components/NavBar";
import { SelectedContext } from "./etc/context";
function App() {
  const [token, setToken] = useState("");
  const selectedState = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <SelectedContext.Provider value={selectedState}>
          <Route path="/" element={<Add />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          </SelectedContext.Provider>
        </Routes>
      </Router>
    </>
  );
}

export default App;
