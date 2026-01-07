import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Visualization from './Visualization';

const App = () => {
    const [exoplanets, setExoplanets] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetch('http://localhost:3001/api/exoplanets')
            .then(response => response.json())
            .then(data => setExoplanets(data));
    }, []);

    const handleSort = (key) => {
        const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(order);
    };

    const sortedExoplanets = [...exoplanets]
        .filter(planet => planet.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <Router>
            <div style={{ color: '#fff', minHeight: '100vh', padding: '20px' }}>
                <nav className="mb-4">
                    <Link to="/" className="btn btn-primary me-2">Home</Link>
                    <Link to="/visualization" className="btn btn-secondary">Visualization</Link>
                </nav>
                <Routes>
                    <Route path="/" element={
                        <>
                            <h1 className="text-center mb-4">Exoplanet Finder</h1>
                            <input
                                type="text"
                                placeholder="Search by planet name"
                                className="form-control mb-4"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <table className="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('name')}>Name</th>
                                        <th onClick={() => handleSort('star')}>Host Star</th>
                                        <th onClick={() => handleSort('method')}>Discovery Method</th>
                                        <th onClick={() => handleSort('period')}>Orbital Period</th>
                                        <th onClick={() => handleSort('radius')}>Radius</th>
                                        <th onClick={() => handleSort('discovery_year')}>Discovery Year</th>
                                        <th onClick={() => handleSort('mass')}>Mass</th>
                                        <th onClick={() => handleSort('temperature')}>Temperature</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedExoplanets.map(planet => (
                                        <tr key={planet.id}>
                                            <td>{planet.name}</td>
                                            <td>{planet.star}</td>
                                            <td>{planet.method}</td>
                                            <td>{planet.period}</td>
                                            <td>{planet.radius}</td>
                                            <td>{planet.discovery_year}</td>
                                            <td>{planet.mass}</td>
                                            <td>{planet.temperature}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    } />
                    <Route path="/visualization" element={<Visualization />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
