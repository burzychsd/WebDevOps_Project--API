// CONFIG SETUP
const express 		= require('express');
const dotenv 		= require('dotenv/config');
const mongoose		= require('mongoose');
const bodyParser 	= require('body-parser');
const users 		= require('./routes/users');

const app = express();

// BODY-PARSER MIDDLEWARE CONFIG
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

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