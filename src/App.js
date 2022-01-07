import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import ClosedLeadsPage from './Pages/Closed';
import AllLeadsPage from './Pages/AllLeads';
import TablesPage from './Pages/TablesPage';
import PredTablesPage from './Pages/PredTablesPage';
import ProfilePage from './Pages/Profile';
import AddModel from './Pages/AddModel';
import Add from './Pages/Add';
import NavBar from './components/NavBar';
import { SelectedContext } from './etc/context';

import {
    Chart as ChartJS,
    LinearScale,
    ArcElement,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Title,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    LinearScale,
    ArcElement,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Title,
    Tooltip
);

function App() {
    const [token, setToken] = useState('');
    const selectedState = useState(null);
    useEffect(() => {
        setToken(localStorage.getItem('token'));
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
                        <Route path="/tables" element={<TablesPage />} />"
                        <Route
                            path="/predtables"
                            element={<PredTablesPage />}
                        />
                        "
                        <Route path="/addmodel" element={<AddModel />} />
                        <Route
                            path="/closedleads"
                            element={<ClosedLeadsPage />}
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Router>
            </SelectedContext.Provider>
        </>
    );
}

export default App;
