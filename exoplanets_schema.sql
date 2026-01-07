CREATE TABLE exoplanets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    star TEXT NOT NULL,
    method TEXT NOT NULL,
    period REAL,
    radius REAL,
    discovery_year INTEGER,
    mass REAL,
    temperature REAL
);