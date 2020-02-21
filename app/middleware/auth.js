const jwt = require('jsonwebtoken');

const { error } = require('../helpers/response');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const { id } = jwt.verify(token, process.env.SECRET);

    req.userId = id;
    req.token = token;

  } catch (err) {
    return error(res, { error: 'Not authorized to access this resource' }, 401)
  }

  next();
}

module.exports = auth;
