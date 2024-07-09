const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

dotenv.config();

const app = express();


app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../CSP/frontend')));

app.use('/api', authRoutes);
app.use('/api', ticketRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../CSP/frontend', 'index.html'));
});

app.get('/' ,(req,res) => {
  res.sendFile(path.json(__dirname, '../CSP/frontend', 'index.html'))
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
