import User from "../models/User.js";

export async function findUserByUsername(username) {
  return User.findOne({ username });
}

export async function findUserById(id) {
  return User.findById(id);
}

export async function createUser(userData) {
  return User.create(userData);
}
