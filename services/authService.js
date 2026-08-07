import bcrypt from "bcrypt";

import {
  createUser,
  findUserByUsername
} from "../repositories/userRepository.js";

const SALT_ROUNDS = 12;

export async function signup(username, password) {
  const cleanedUsername = username?.trim();

  if (!cleanedUsername) {
    throw new Error("Username is required.");
  }

  if (cleanedUsername.length < 3) {
    throw new Error("Username must be at least 3 characters.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const existingUser = await findUserByUsername(cleanedUsername);

  if (existingUser) {
    throw new Error("Username is already taken.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return createUser({
    username: cleanedUsername,
    passwordHash,
    role: "member"
  });
}

export async function login(username, password) {
  const cleanedUsername = username?.trim();

  if (!cleanedUsername || !password) {
    throw new Error("Username and password are required.");
  }

  const user = await findUserByUsername(cleanedUsername);

  if (!user) {
    throw new Error("Invalid username or password.");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("Invalid username or password.");
  }

  return user;
}