import { Op } from "sequelize";
import _ from "lodash";
import async from "async";
import config from "config";
import { Request,Response } from "express";
import {
  Error,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/Errors";
import { User } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import UserService from "../services/User.service";
import { request } from "http";
import { generateAccessToken } from "../helpers/security/Security";
class LoginController {
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
    /**
   * jwt Login User Authentication
   *
   * @param {Request} request
   * @param {Response} response
   */
    static Login(request: Request, response: Response, next: Function) {
        const body = {
        username: request.body.username,
        password: request.body.password,
        };
        console.log("Body ",body)
        UserService.findOne({
            username:body.username,
            password:body.password
        },[],[]).then((user:User)=>{
            if(user){
                delete user.password;
                const token = generateAccessToken(user);
                response.json({
                    user:user,
                    token:token,
                    isSuperAdmin:user.isSuperAdmin
                })
            }
        }).catch((error)=>{
            next(new UnauthorizedError("Incorrect Credentials"))
        })
    }
}
export default LoginController;