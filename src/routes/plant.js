const express = require('express');
const Plant = require('../models/plant');
const auth = require ('../middleware/auth');
const upload = require('../middleware/upload');
const resize = require('../middleware/resize');

const router = new express.Router();

// Create plant
/* 
  "name": "Plant",
  "waterInterval": 14,
  "pests": true,
  "inCollection": false
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
router.delete('/plants/:id', auth, async (req, res) => {
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
  "pests": false
*/
router.patch('/plants/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'waterInterval', 'inCollection', 'notes', 'pests']; // Notes need to be addressed separately
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

// Show plant by id
router.get('/plants/:id', auth, async(req, res) => {
  try {
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant) {
      return res.status(404).send();
    }

    res.send(plant);
  } catch (err) {
    res.status(500).send(err);
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

// Upload plant picture
router.post('/plants/:id/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const image = await resize(req.file.buffer);
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant) {
      return res.status(404).send();
    }

    plant.image = image;
    await plant.save();

    res.send();
  } catch (err) {
    res.status(400).send(err);
  }   
});

// Delete plant picture
router.delete('/plants/:id/image', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant || !plant.image) {
      return res.status(404).send();
    }

    plant.image = undefined;
    await plant.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
}); 

// Fetch plant picture by id
router.get('/plants/:id/image', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant || !plant.image) {
      return res.status(404).send();
    }

    res.set('Content-Type', 'image/png').send(plant.image);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add note to plant
router.post('/plants/:id/notes', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant) {
      return res.status(404).send();
    }

    plant.notes.push(req.body);

    await plant.save();
    res.send(plant);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete note by id
router.delete('/plants/:id/:noteId', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({owner: req.user._id, _id: req.params.id});

    if (!plant) {
      return res.status(404).send();
    }

    plant.notes.remove(req.params.noteId);

    await plant.save();

    res.send(plant);
  } catch(err) {
    res.status(500).send(err);
  }
});

module.exports = router;