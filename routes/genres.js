const validateObjectId = require('../middleware/validateObjectid')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const {Genre, validate} = require('../models/generes');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { // a simple get request to get the root page and show the genres.
    const genre = await Genre.find().sort('name');
    res.send(genre);
});

router.post('/', auth, async (req, res) => {             // Post request that will validate the genre.
    const { error } = validate(req.body);      // Here validateGenere is a function that will validate the genre name and it must contain minimum of 3 words.
    if ( error ) return res.status(400).send(error.details[0].message);     //error block that will thro wht 400 error message.

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {    // put request for sending the courses with ID.
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if(!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => { // to delete a certain genre.
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if(!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.get('/:id',validateObjectId, async (req,res) => { // get request wih ID.

    const genre= await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

module.exports = router;

