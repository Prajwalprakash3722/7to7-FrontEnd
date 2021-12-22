import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import ClosedLeadsPage from "./Pages/Closed";
import AllLeadsPage from "./Pages/AllLeads";
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
      <SelectedContext.Provider value={selectedState}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Add />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/allleads" element={<AllLeadsPage />} />
            <Route path="/closedleads" element={<ClosedLeadsPage />} />
          </Routes>
        </Router>
      </SelectedContext.Provider>
    </>
  );
}

export default App;
