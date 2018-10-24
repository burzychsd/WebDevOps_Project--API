// USERS ROUTES
const express	= require('express');
const router	= express.Router(); // similar to const app in server.js

// GET USERS ROUTE -- PUBLIC
// u don't need to include previous path '/users' from server.js, just the next part
// also, 'res.json()', as u probably know, its like res.send but it outputs json file 
router.get('/user', (req, res) => res.json({ test: 'Works' }));


module.exports = router;