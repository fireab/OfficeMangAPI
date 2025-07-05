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
import { Employee, Rate, Comment } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
class RateService {
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
  ): Promise<Rate[]> {
    return new Promise((resolve, reject) => {
      Rate.findAll({
        where: query,
        order: order,
        include: includes,
      })
        .then((result: Rate[]) => resolve(result))
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
  ): Promise<Rate> {
    return new Promise((resolve, reject) => {
      Rate.findOne({
        where: query,
      })
        .then((result: Rate) => {
          if (!result) {
            reject(new BadRequestError([{ messages: "RateNot Found" }]));
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
  static create(
    body: {
      CustomerService: string;
      StandardService: string;
      FairService: string;
      ResponseForCompliment: string;
      ServiceRate: string;
      EmployeeId: number;
      year: number | null;
      name: string | null;
      phone: string | null;
    },
    transaction?: Transaction
  ): Promise<Rate> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            console.log("the employee id and data", body);

            Rate.create(body)
              .then((result: Rate) => resolve(result))
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
  // static rateAll(body: {
  //   ServiceRate:string;
  //   year:number|null;
  //   name:string|null,
  //   phone:string|null
  // }, transaction?: Transaction): Promise<Rate> {
  //   return new Promise((resolve, reject) => {
  //     async.waterfall(
  //       [
  //         ( done: Function) => {
  //           Rate.create(body)
  //             .then((result: Rate) => resolve(result))
  //             .catch((error: any) => reject(new BadRequestError(error)));
  //         },
  //       ],
  //       (error: Error) => {
  //         if (error) {
  //           reject(error);
  //         }
  //       }
  //     );
  //   });
  // }

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
  ): Promise<Rate> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            this.findOne(query, [], [])
              .then((rate: Rate) => done(null, rate))
              .catch((error: Error) => done(error));
          },
          (feedback: Rate, done: Function) => {
            feedback
              .update({
                where: query,
              })
              .then((result: Rate) => resolve(result))
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
  /**
   *
   */
  static findManyPaginate(
    query: any,
    order: any,
    page: number,
    limit: number
  ): Promise<{
    data: any[];
    metadata: {
      pagination: {
        page: number;
        limit: number;
        numberOfPages: number;
        numberOfResults: number;
      };
    };
  }> {
    return new Promise(async (resolve, reject) => {
      let count: number = await Rate.count();
      Rate.findAll({
        where: query,
        limit: limit,
        offset: (page - 1) * limit,
        order: order,
        include: { model: Employee },
      })
        .then((result: Rate[]) =>
          resolve({
            data: result,
            metadata: {
              pagination: {
                page: page,
                limit: limit,
                numberOfPages: count,
                numberOfResults: Math.ceil(count / limit),
              },
            },
          })
        )
        .catch((error: any) => reject(error));
    });
  }
  // static fetchAllRate(
  // ): Promise<Rate[]> {
  //   return new Promise((resolve, reject) => {
  //     .findAll()
  //     .then((rate:Rate[])=>{
  //       resolve(rate)
  //     })
  //     .catch((error)=>{
  //       reject(error);
  //     })
  //   });
  // }
}
export default RateService;
