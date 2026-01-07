import React, { useState, useEffect } from 'react';

const Home = () => {
    const [exoplanets, setExoplanets] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetch('http://localhost:3001/api/exoplanets')
            .then(response => response.json())
            .then(data => setExoplanets(data));
    }, []);

    const sortedExoplanets = React.useMemo(() => {
        let sortableExoplanets = [...exoplanets];
        if (sortConfig.key) {
            sortableExoplanets.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableExoplanets;
    }, [exoplanets, sortConfig]);

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredExoplanets = sortedExoplanets.filter(planet =>
        planet.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
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
                        <th onClick={() => requestSort('name')}>Name</th>
                        <th onClick={() => requestSort('star')}>Host Star</th>
                        <th onClick={() => requestSort('method')}>Discovery Method</th>
                        <th onClick={() => requestSort('period')}>Orbital Period</th>
                        <th onClick={() => requestSort('radius')}>Radius</th>
                        <th onClick={() => requestSort('discovery_year')}>Discovery Year</th>
                        <th onClick={() => requestSort('mass')}>Mass</th>
                        <th onClick={() => requestSort('temperature')}>Temperature</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExoplanets.map(planet => (
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
        </div>
    );
};

export default Home;