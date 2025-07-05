import { Op, where } from "sequelize";
import _ from "lodash";
import async from "async";
import config from "config";

import {
  Error,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/Errors";
import { User } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
class UserService {
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findMany(
    query: any,
    order: any,
    includes: any,
    transaction?: Transaction
  ): Promise<User[]> {
    return new Promise((resolve, reject) => {
      User.findAll({
        where:query,
        order:order,
        include:includes
      })
        .then((result: User[]) => resolve(result))
        .catch((error: any) => reject(error));
    });
  }
  static findManyPaginate(query: any, order: any, page: number, limit: number) {
    return new Promise(async (resolve, reject) => {
      let count:number=await User.count({where:query});
      User.findAll({
        where: query,
        limit: limit,
        offset: (page - 1) * limit,
        order: order,
      })
        .then((result: User[]) => resolve(
          {
            data: result,
            metadata: {
              pagination: {
                page: page,
                limit: limit,
                numberOfPages: Math.ceil(count / limit),
                numberOfResults:count ,
              }
            }
        }
        ))
        .catch((error: any) => reject(error));
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
  static findOne(
    query: any,
    order: any,
    includes: any,
    transaction?: Transaction
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      User.findOne({
        where:query
      })
        .then((result: User) => {
          if (!result) {
            reject(
              new BadRequestError([{ messages: "UserNot Found"}])
            );
          } else {
            resolve(result);
          }
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static create(body: {
    
    username: string
    password: string
    firstname:string,
    lastname:string,
    email:string,
    isSuperAdmin:boolean
  }, transaction?: Transaction): Promise<User> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          ( done: Function) => {
            User.create(body)
              .then((result: User) => resolve(result))
              .catch((error: any) => reject(new BadRequestError(error)));
          },
        ],
        (error: Error) => {
          if (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   *
   * @param query
   * @param body
   * @param transaction
   * @returns
   */
  static update(
    query: any,
    body: any,
    transaction?: Transaction
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            console.log("h1");
            
            this.findOne(query, [], [])
              .then((user:User) => done(null,user))
              .catch((error: Error) => done(error));
          },
          (user:User,done: Function) => {
            console.log("h2");
            user.update(body)
              .then((result: User) => resolve(result))
              .catch((error: any) => done(new InternalServerError(error)));
          },
        ],
        (error: Error) => {
          if (error) {
            reject(error);
          }
        }
      );
    });
  }
  static deleteUser(
    id: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            console.log("h1");
            
            this.findOne({id:id}, [], [])
              .then((user:User) => done(null,user))
              .catch((error: Error) => done(error));
          },
          async (user:User,done: Function) => {
            console.log("h2");
            let d= await User.destroy({
              where:{id:id}
            })
            resolve("Done")
          },
        ],
        (error: Error) => {
          if (error) {
            reject(error);
          }
        }
      );
    });
  }
}
export default UserService;
