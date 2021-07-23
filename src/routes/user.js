const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();


// Create user

/* 
{
  "name": "Stephan",
  "email": "stephansemail@fantasyproviderofchoice.com",
  "password": "Password123"
}
*/

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({user, token});
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login user

/* 
{
  "email": "stephansemail@fantasyproviderofchoice.com",
  "password": "Password123" 
}
*/

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCreds(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (err) {
    res.status(400).send(err);
  }
});

// Show profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// Update profile
/* 
  "name": "new Name",
  "email": "stephansnewemail@fantasyproviderofchoice.com",
  "password": "newPassword123"
*/
router.patch('/users/me', auth, async (req, res) => {
  const allowedUpdates = ['email', 'password', 'name'];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowedUpdates.includes(update));


  if (!isValid) {
    res.status(400).send({error: 'Invalid updates'});
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete user
router.delete('/users/me/deleteUser', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Logout
router.get('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    req.status(500).send(err);
  }
});

module.exports = router;