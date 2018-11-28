// NOTES ROUTES
const express	= require('express');
const router	= express.Router();
const passport	= require('passport'); // we need to use passport for creating protective route

// LOAD NOTE & USER & PERSON MODEL
const Note 		= require('../models/Note');
const User 		= require('../models/User');
const Person 	= require('../models/Person');

// LOAD NOTES CONTROLLERS
const NotesControllers = require('../controllers/NotesControllers');

// GET ALL USER NOTES -- PRIVATE
// for fetching all notes from db
router.get('/notes', passport.authenticate('jwt', { session: false }), NotesControllers.get_all_notes);

// GET ALL ARCHIVE NOTES -- PRIVATE
// for fetching archive notes from db
router.get('/notes/archive', passport.authenticate('jwt', { session: false }), NotesControllers.get_archive_notes);

// GET ALL ARCHIVE NOTES -- PRIVATE
// for fetching archive notes from db
router.get('/notes/delete', passport.authenticate('jwt', { session: false }), NotesControllers.get_delete_notes);

// GET SPECIFIC NOTE -- PRIVATE
// for fetching specific note from db
router.get('/notes/:id', passport.authenticate('jwt', { session: false }), NotesControllers.get_specific_note);

// POST NOTE ROUTE -- PRIVATE
// creation of note, sending post request
router.post('/notes', passport.authenticate('jwt', { session: false }), NotesControllers.post_note);

// PUT NOTE ROUTE (ARCHIVE) -- PRIVATE
// updating note
router.put('/notes/archive/:id', passport.authenticate('jwt', { session: false }), NotesControllers.update_note_archive);

// PUT NOTE ROUTE (DELETE) -- PRIVATE
// updating note
router.put('/notes/delete/:id', passport.authenticate('jwt', { session: false }), NotesControllers.update_note_delete)

// DELETE NOTE ROUTE -- PRIVATE
// deleting the specific note
router.delete('/notes/:id', passport.authenticate('jwt', { session: false }), NotesControllers.delete_note);

module.exports = router;