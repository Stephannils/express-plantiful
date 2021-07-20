const express = require('express');
const Plant = require('../models/plant');
const auth = require ('../middleware/auth');

const router = new express.Router();

// Create plant
router.post('/plants', auth, async (req, res) => {
  const plant = new Plant({
    ...req.body,
    owner: req.user._id
  });

  try {
    await plant.save();
    res.status(201).send(plant);
  } catch (err) {
    res.status(400).send();
  }
});

// Delete plant
router.get('/plants/:id', auth, async (req, res) => {
  try {
    const task = await Plant.findOneAndDelete({_id: req.params.id, owner: req.user._id});

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;