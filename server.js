// CONFIG SETUP
const express 		= require('express');
const cors 			= require('cors')
const dotenv 		= require('dotenv/config');
const mongoose		= require('mongoose');
const bodyParser 	= require('body-parser');
const passport      = require('passport');
const users 		= require('./routes/users');
const notes			= require('./routes/notes');

const app = express();

// CORS
app.use(cors());

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

// PASSPORT SETUP
app.use(passport.initialize());

// PASSPORT CONFIG
// higher-order function docs: https://hackernoon.com/higher-order-functions-what-are-they-be74111659e8
require('./config/passport')(passport);

// ROUTES SETUP
app.use('/api', users);
app.use('/api', notes);

// SERVER SETUP
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));