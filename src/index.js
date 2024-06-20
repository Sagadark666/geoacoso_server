const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// Define a list of allowed origins
const allowedOrigins = [
  'https://www.acososexualyopal.com', // Typically you would not specify the port if serving over https
  'http://18.191.56.149:3000',         // Replace with your actual server IP and port
  'http://172.31.45.244:3000',         // Replace with your actual server IP and port
  'http://localhost:3000'              // Localhost for development
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (like curl requests or same-origin)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

app.use(cors(corsOptions));

// Initialize SQLite database
const db = new sqlite3.Database('./geoacoso.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS coordinates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude FLOAT,
      longitude FLOAT,
      captured_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Get all coordinates
app.get('/coordinates', (req, res) => {
  db.all('SELECT * FROM coordinates', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Add a new coordinate
app.post('/coordinates', (req, res) => {
  console.log(`New report captured at ${new Date()}`);
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    res.status(400).send('Invalid input');
    return;
  }
  db.run(
    'INSERT INTO coordinates (latitude, longitude, captured_at) VALUES (?, ?, datetime(\'now\'))',
    [latitude, longitude],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
