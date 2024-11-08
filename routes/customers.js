// we are going to implement working with customers
const {Customer, validate} = require('../models/customer'); // importing from /models/customers.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { // a simple get request to get the root page and show the genres.
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {             // Post request that will validate the genre.
    const { error } = validate(req.body);      // Here validateGenere is a function that will validate the genre name and it must contain minimum of 3 words.
    if ( error ) return res.status(400).send(error.details[0].message);     //error block that will thro wht 400 error message.

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold, 
        phone: req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      }, { new: true });
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(customer);
  });
  
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
});
  
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
});


module.exports = router;
