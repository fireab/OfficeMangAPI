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
import { Employee, Rate, FeedBack } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
class FeedBackService {
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
  ): Promise<FeedBack[]> {
    return new Promise((resolve, reject) => {
        FeedBack.findAll({
        where:query,
        order:order,
        include:includes
      })
        .then((result: FeedBack[]) => resolve(result))
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
  ): Promise<FeedBack> {
    return new Promise((resolve, reject) => {
        FeedBack.findOne({
        where:query
      })
        .then((result: FeedBack) => {
          if (!result) {
            reject(
              new BadRequestError([{ messages: "RateNot Found"}])
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
    type:string
    content: string|null
    name: string|null
    email:string|null
    phone:string|null
  }, transaction?: Transaction): Promise<FeedBack> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          ( done: Function) => {
            FeedBack.create(body)
              .then((result: FeedBack) => resolve(result))
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
  ): Promise<FeedBack> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            this.findOne(query, [], [])
              .then((rate:FeedBack) => done(null,rate))
              .catch((error: Error) => done(error));
          },
          (feedback:FeedBack,done: Function) => {
            feedback.update({
              where:query,
            })
              .then((result: FeedBack) => resolve(result))
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
    limit: number,
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
      let count:number=await FeedBack.count();
      FeedBack.findAll({
        where: query,
        limit: limit,
        offset: (page - 1) * limit,
        order: order,
        include:[]
      })
        .then((result: FeedBack[]) => resolve(
          {
            data: result,
            metadata: {
              pagination: {
                page: page,
                limit: limit,
                numberOfPages: count,
                numberOfResults: Math.ceil(count / limit),
              }
            }
        }
        ))
        .catch((error: any) => reject(error));
    });
  }
}
export default FeedBackService;
