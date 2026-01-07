import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Visualization = () => {
    const [exoplanets, setExoplanets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/exoplanets')
            .then(response => response.json())
            .then(data => setExoplanets(data));
    }, []);

    const getDiscoveryMethodData = () => {
        const methodCounts = {};
        exoplanets.forEach(planet => {
            if (planet.method) {
                methodCounts[planet.method] = (methodCounts[planet.method] || 0) + 1;
            }
        });
        return Object.entries(methodCounts)
            .map(([method, count]) => ({ method, count }))
            .sort((a, b) => b.count - a.count);
    };

    const getDiscoveryYearData = () => {
        const yearCounts = {};
        exoplanets.forEach(planet => {
            if (planet.discovery_year) {
                yearCounts[planet.discovery_year] = (yearCounts[planet.discovery_year] || 0) + 1;
            }
        });
        return Object.entries(yearCounts)
            .map(([year, count]) => ({ year: Number(year), count }))
            .sort((a, b) => a.year - b.year);
    };

    const getHybridRangeData = (key, smallStep, largeStep, threshold) => {
        const rangeCounts = {};
        exoplanets.forEach(planet => {
            const value = parseFloat(planet[key]);
            if (!isNaN(value) && value !== null) {
                let start;
                let end;
                
                if (value < threshold) {
                    const bucket = Math.floor(value / smallStep);
                    start = bucket * smallStep;
                    end = start + smallStep;
                } else {
                    const bucket = Math.floor(value / largeStep);
                    start = bucket * largeStep;
                    end = start + largeStep;
                }

                const label = `${start}-${end}`;
                if (!rangeCounts[label]) {
                    rangeCounts[label] = { range: label, count: 0, sortOrder: start };
                }
                rangeCounts[label].count += 1;
            }
        });

        return Object.values(rangeCounts).sort((a, b) => a.sortOrder - b.sortOrder);
    };

    const getRangeData = (key, rangeSize) => {
        const rangeCounts = {};
        exoplanets.forEach(planet => {
            const value = parseFloat(planet[key]);
            if (!isNaN(value) && value !== null) {
                const bucket = Math.floor(value / rangeSize);
                rangeCounts[bucket] = (rangeCounts[bucket] || 0) + 1;
            }
        });

        return Object.entries(rangeCounts)
            .map(([bucket, count]) => {
                const start = Number(bucket) * rangeSize;
                const end = start + rangeSize;
                return {
                    range: `${start}-${end}`,
                    count,
                    start
                };
            })
            .sort((a, b) => a.start - b.start);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Exoplanet Data Visualization</h1>

            <section>
                <h2 style={{ textAlign: 'center' }}>Discovery Methods</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getDiscoveryMethodData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="method" angle={-45} textAnchor="end" interval={0} height={80} stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="count" fill="#8884d8" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            <section style={{ marginTop: '50px' }}>
                <h2 style={{ textAlign: 'center' }}>Discovery Year</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getDiscoveryYearData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="count" fill="#82ca9d" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            <section style={{ marginTop: '50px' }}>
                <h2 style={{ textAlign: 'center' }}>Orbital Period (Days)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getHybridRangeData('period', 10, 50, 50)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="count" fill="#8884d8" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            <section style={{ marginTop: '50px' }}>
                <h2 style={{ textAlign: 'center' }}>Radius (Earth Radii)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getRangeData('radius', 2)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="count" fill="#82ca9d" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            <section style={{ marginTop: '50px' }}>
                <h2 style={{ textAlign: 'center' }}>Mass (Jupiter Masses)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getHybridRangeData('mass', 1, 5, 5)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="count" fill="#d884d8" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            <section style={{ marginTop: '50px' }}>
                <h2 style={{ textAlign: 'center' }}>Temperature (K)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getRangeData('temperature', 500)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="count" fill="#84d8d8" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </section>
        </div>
    );
};

export default Visualization;