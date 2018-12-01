// PERSONS ROUTES
const express	= require('express');
const router	= express.Router();
const passport	= require('passport'); // we need to use passport for creating protective route

// LOAD PERSON CONTROLLER
const PersonController = require('../controllers/PersonController');

// GET ALL PERSONS -- PRIVATE
// for fetching all persons from db
router.get('/persons', passport.authenticate('jwt', { session: false }), PersonController.get_all_persons);

module.exports = router;