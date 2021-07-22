const express = require('express');
const Plant = require('../models/plant');
const auth = require ('../middleware/auth');

const router = new express.Router();

// Create plant
/* 
  "name": "Plant",
  "waterInterval": 14,
  "inCollection": false,  
*/
router.post('/plants', auth, async (req, res) => {
  const plant = new Plant({
    ...req.body,
    owner: req.user._id
  });

  try {
    await plant.save();
    res.status(201).send(plant);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete plant
router.get('/plants/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({_id: req.params.id, owner: req.user._id});

    if (!plant) {
      return res.status(404).send();
    }

    res.send(plant);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update plant
/* 
  "name": "new Name",
  "waterInterval": 14,
  "inCollection": true,
*/
router.patch('/plants/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'waterInterval', 'inCollection'];
  const isValid = updates.every(update => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({error: 'Invalid updates'});
  }

  try {
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant) {
      return res.status(404).send();
    }

    updates.forEach(update => plant[update] = req.body[update]);

    await plant.save();
    res.send(plant);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Show plants
router.get('/plants', auth, async (req, res) => {
  try {
    const plants = await Plant.find({owner: req.user._id});

    if (!plants) {
      return res.status(404).send();
    }

    res.send(plants);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;