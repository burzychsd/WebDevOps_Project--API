// CONFIG SETUP
const express 	= require('express');
const dotenv 	= require('dotenv/config');
const mongoose	= require('mongoose');

const users = require('./routes/users');

const app = express();

// DB CONFIG
const db = require('./config/db_connection').url;

// CONNECT TO OUR DATABASE
mongoose.connect(db, { useNewUrlParser: true })
		.then(() => console.log('Database Connected'))
		.catch(err => console.log(err));

// ROUTES SETUP
app.use('/users', users);

// SERVER SETUP
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));