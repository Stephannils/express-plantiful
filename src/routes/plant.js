const express = require('express');
const Plant = require('../models/plant');
const auth = require ('../middleware/auth');

const router = new express.Router();


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

module.exports = router;