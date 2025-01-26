const express = require('express')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express()
dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running')
})

// routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});