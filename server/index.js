const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Demo route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Example POST route
app.post('/echo', (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});