import config from "config";
import { Op } from "sequelize";
import JwtStrategy from "passport-jwt";
import LocalStrategy from "passport-local";

import { comparePassword } from "./Security";
import Messages from "../../errors/Messages";
import { User } from "../database/Sequelize";
import UserService from "../../services/User.service";


/**
 * Passport JWT Strategy
 *
 * @param email
 * @param password
 */
export const PassportJWTStrategy = new JwtStrategy.Strategy(
  {
    jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get("security.jwt.secret"),
  },
  (payload, done) => {
    UserService.findOne({ id: payload.id }, [], [])
      .then((user: User) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(() => {
        return done(null, false);
      });
  }
);
