import { Op, where } from "sequelize";
import _ from "lodash";
import async from "async";
import config from "config";

import { Error, BadRequestError, InternalServerError } from "../errors/Errors";
import { AudioFeedBack } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
class AudioFeedBackService {
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
  ): Promise<AudioFeedBack[]> {
    return new Promise((resolve, reject) => {
      AudioFeedBack.findAll({
        where: query,
        order: order,
        include: includes,
      })
        .then((result: AudioFeedBack[]) => resolve(result))
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
  ): Promise<AudioFeedBack> {
    return new Promise((resolve, reject) => {
      AudioFeedBack.findOne({
        where: query,
      })
        .then((result: AudioFeedBack) => {
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
      file_name: string;
      file_path: string;
      name: string;
      phone: string;
    },
    transaction?: Transaction
  ): Promise<AudioFeedBack> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            AudioFeedBack.create(body)
              .then((result: AudioFeedBack) => resolve(result))
              .catch((error: any) => {
                console.log("--- error ---", error);

                reject(new BadRequestError(error));
              });
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
  ): Promise<AudioFeedBack> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            this.findOne(query, [], [])
              .then((rate: AudioFeedBack) => done(null, rate))
              .catch((error: Error) => done(error));
          },
          (feedback: AudioFeedBack, done: Function) => {
            feedback
              .update({
                where: query,
              })
              .then((result: AudioFeedBack) => resolve(result))
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
      let count: number = await AudioFeedBack.count();
      AudioFeedBack.findAll({
        where: query,
        limit: limit,
        offset: (page - 1) * limit,
        order: order,
        include: [],
      })
        .then((result: AudioFeedBack[]) =>
          resolve({
            data: result,
            metadata: {
              pagination: {
                page: page,
                limit: limit,
                numberOfPages: Math.ceil(count / limit),
                numberOfResults: count,
              },
            },
          })
        )
        .catch((error: any) => reject(error));
    });
  }
}
export default AudioFeedBackService;
