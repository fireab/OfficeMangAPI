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
} from "../errors/Errors";
import { User } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import UserService from "../services/User.service";
import { request } from "http";
class UserController {

  static profile(
    request: Request,
    response: Response,
    next: Function){
      let user=<User>request.user;
      UserService.update({id:user.id},request.body)
        .then((result: User) => response.send(result))
        .catch((error: any) => next(error));
    }
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findMany(
    request: Request,
    response: Response,
    next: Function,
  ){
    return new Promise((resolve, reject) => {
      console.log("User service")
      let page=_.toNumber(request.query.page) || 1;
      let limit=_.toNumber(request.query.limit) || 10;
      UserService.findManyPaginate(request.body,[],page,limit)
        .then((result: User[]) => response.send(result))
        .catch((error: any) => next(error));
    });
  }

  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findById(
    request: Request,
    response: Response,
    next: Function,
  ){
    UserService.findOne({id:request.params.id}, [], [])
        .then((result: User) => {
          response.send(result);
        })
        .catch((error: any) => next(error));
  }

  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static create(request: Request,
    response: Response,
    next: Function) {
      UserService.create({
        username: request.body.username,
        password: request.body.password,
        firstname:request.body.firstname,
        lastname:request.body.lastname,
        email:request.body.email,
        isSuperAdmin:request.body.isSuperAdmin,
      })
        .then((result: User) => response.send(result))
        .catch((error: any) => next(new BadRequestError(error)));
  }

  /**
   *
   * @param query
   * @param body
   * @param transaction
   * @returns
   */
  static update(
    request: Request,
    response: Response,
    next: Function
  ){
    let id=request.params.id;
    if (!id) {
      let user=<User>request.user;
      id=user.id.toString();
    }
    console.log("User Update",id)
    UserService.update({id:id}, request.body)
    .then((result: User) => response.send(result))
    .catch((error: any) => {
      console.log("Error ",error)
      next(error)});
  }
  static deleteUser(
    request: Request,
    response: Response,
    next: Function
  ){
    UserService.deleteUser(request.params.id)
    .then((result: any) => response.send(result))
    .catch((error: any) => {
      console.log("Error ",error)
      next(error)});
  }
}

export default UserController;
