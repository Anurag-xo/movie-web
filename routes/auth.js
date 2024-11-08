const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);      // Here validateGenere is a function that will validate the genre name and it must contain minimum of 3 words.
    if ( error ) return res.status(400).send(error.details[0].message);     //error block that will thro wht 400 error message.

    let user = await User.findOne({email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');
    
    const token = user.generateAuthToken();
    res.send(token);

});

function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}


module.exports = router;