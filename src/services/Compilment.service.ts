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
import { Compliment } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
class ComplimentService {
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
  ): Promise<Compliment[]> {
    return new Promise((resolve, reject) => {
      Compliment.findAll({
        where:query
      })
        .then((result: Compliment[]) => resolve(result))
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
  ): Promise<Compliment> {
    return new Promise((resolve, reject) => {
      Compliment.findOne({
        where:query
      })
        .then((result: Compliment) => {
          if (!result) {
            reject(
              new BadRequestError([{ messages: "ComplimentNot Found"}])
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
  static create(body: any, transaction?: Transaction): Promise<Compliment> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          ( done: Function) => {
            Compliment.create(body)
              .then((result: Compliment) => resolve(result))
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
  ): Promise<Compliment> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            this.findOne(query, [], [])
              .then((compliment:Compliment) => done(null,compliment))
              .catch((error: Error) => done(error));
          },
          (compliment:Compliment,done: Function) => {
            delete body.id;
            compliment.update(body)
              .then((result: Compliment) => resolve(result))
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
      console.log("Find MANY Paginate")
      let count:number=await Compliment.count();
      Compliment.findAll({
        where: query,
        limit: limit,
        offset: (page - 1) * limit,
        order: [['id', 'DESC']],
      })
        .then((result: Compliment[]) => resolve(
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
}
export default ComplimentService;
