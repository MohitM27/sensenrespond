const UserModel = require("../models/User");

exports.createUser = async (user) => {
  return await UserModel.create(user);
};
exports.getUserById = async (id) => {
  return await UserModel.findById(id);
};

exports.getUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};
