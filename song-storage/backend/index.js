const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const songRoutes = require('./routes/songRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/users', userRoutes);


app.listen(port, () => {
    console.log(`Express.js backend running at http://localhost:${port}`);
});
