const express = require('express');
const router = express.Router();

const { success, error } = require('../helpers/response');
const userService = require('../services/users.service');

router.get('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await userService.login({ username, password });
    success(res, newUser);
  } catch (err) {
    error(res, err)
  }
});

router.post('/', async (req, res) => {
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
