import config from "config";
import jsonwebtoken from "jsonwebtoken";

import { User } from "../database/Sequelize";

/**
 * Hash Password
 *
 * @param {string} password
 * @param {string} saltRound
 */
export const hash = (password: string, saltRound: string) => {
  return new Promise((resolve, reject) => {
    resolve(null)
  });
};

/**
 * Compare Password
 *
 * @param {string} candidatePassword
 * @param {string} password
 */
export const comparePassword = (
  candidatePassword: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    resolve(null)
  });
};

/**
 * Generate JWT Access Token
 *
 * @param {User}   user
 */
export const generateAccessToken = (user: User) => {
  return jsonwebtoken.sign({ id: user.id }, config.get("security.jwt.secret"));
};
