const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const discogsRoutes = require('./routes/discogsRoutes');
const nasaRoutes = require('./routes/nasaRoutes');



require('dotenv').config();

const songRoutes = require('./routes/songRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/songs', songRoutes);
app.use('/users', userRoutes);
app.use('/api/discogs', discogsRoutes);
app.use('/nasa', nasaRoutes);


app.listen(port, () => {
    console.log(`Express.js backend running at http://localhost:${port}`);
});
