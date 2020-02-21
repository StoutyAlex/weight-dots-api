const express = require('express');
const router = express.Router();

const { success, error } = require('../helpers/response');
const userService = require('../services/users.service');

router.get('/', async (req, res) => {
  try {
    const users = await userService.getAll();
    success(res, users);
  } catch (err) {
    error(res, err);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService._delete(id);
    success(res, user);
  } catch (err) {
    error(res, err);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await userService.login({ username, password });
    success(res, newUser);
  } catch (err) {
    error(res, err)
  }
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    await userService.create({ username, password });
    const loginUser = await userService.login({ username, password });
    success(res, loginUser);
  } catch (err) {
    error(res, err)
  }
});

module.exports = router;
