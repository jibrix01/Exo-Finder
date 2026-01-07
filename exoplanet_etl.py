import requests
import pandas as pd
import sqlite3

# NASA Exoplanet Archive API endpoint
url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,discoverymethod,pl_orbper,pl_rade,disc_year,pl_bmassj,pl_eqt+from+ps+where+default_flag=1&format=json"

# Fetch data from NASA API
response = requests.get(url)
response.raise_for_status()  # Raise an error for bad status codes

data = response.json()

# Convert data to DataFrame
df = pd.DataFrame(data)

# Rename columns to match database schema
df = df.rename(columns={
    'pl_name': 'name',
    'hostname': 'star',
    'discoverymethod': 'method',
    'pl_orbper': 'period',
    'pl_rade': 'radius',
    'disc_year': 'discovery_year',
    'pl_bmassj': 'mass',
    'pl_eqt': 'temperature'
})

# Drop rows with missing values
df = df.dropna()

# Save data to SQLite database
conn = sqlite3.connect('exoplanets.db')
df.to_sql('exoplanets', conn, if_exists='replace', index=False)
conn.close()

print("ETL process completed successfully. Data pulled from NASA's Exoplanet Archive.")