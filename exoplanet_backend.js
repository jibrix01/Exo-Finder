const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('exoplanets.db');

app.use(cors());

app.get('/api/exoplanets', (req, res) => {
    const { method } = req.query;
    let query = 'SELECT * FROM exoplanets';
    const params = [];

    if (method) {
        query += ' WHERE method = ?';
        params.push(method);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching exoplanets');
        } else {
            res.json(rows);
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));