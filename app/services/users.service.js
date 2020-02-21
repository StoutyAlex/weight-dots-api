const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Users = require('../models/users.model');

const _delete = async (userId) => {
  const user = await Users.findByIdAndRemove(userId);
  return user;
}

const getAll = async () => {
  const users = await Users.find({});
  return users;
}

const login = async ({ username, password }) => {
  const user = await Users.findOne({ username });

  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, __v, ...trimmedUser } = user.toObject();
    const token = jwt.sign({ id: user.id }, process.env.SECRET);

    return {
        ...trimmedUser,
        token
    };
  }

  throw {
    statusCode: 400,
    message: 'Could not find user at login...',
  }
};

const create = async ({ username, password }) => {
  // validate
  if (await Users.findOne({ username: username })) {
    throw {
      statusCode: 400,
      message: "Username '" + username + "' is already taken.",
    }
  }

  const user = new Users({
    username,
    password
  });

  // hash password
  if (password) {
    user.hash = bcrypt.hashSync(password, 10);
  }

  // save user
  const newUser = await user.save();
  return newUser;
};


module.exports = {
  login,
  create,
  getAll,
  _delete
};
