import jwt from "jsonwebtoken";
import User from "../services/user";

const { userExist } = User;
require("dotenv").config();

/**
 * @class Authentication
 * @description authenticate token and roles
 * @exports Authentication
 */
export default class Authentication {
  /**
   * @param {object} req - The res body object
   * @param {object} res - The res body object
   * @param {object} next -  The function to call next
   * @returns {Function} errorResponse | next
   */
  static async verifyToken(req, res, next) {
    try {
      let decoded;
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            decoded = await jwt.verify(token, process.env.JWT_KEY);
            req.user = await userExist(decoded.id);
            if (!req.user) return res.status(404).json({ status: 404, message: "User account not found" });

            return next();
          }
        } else {
          return res.status(401).json({ status: 401, message: "Invalid authorization format" });
        }
      } else {
        return res.status(401).json({ status: 401, message: "Authorization not found" });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}
