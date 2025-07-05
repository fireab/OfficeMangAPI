import { Op } from "sequelize";
import _ from "lodash";
import { Request, Response } from "express";
import { BadRequestError } from "../errors/Errors";
import { AudioFeedBack, FeedBack } from "../helpers/database/Sequelize";
import { ImagePathResolver } from "../helpers/upload/PathResolver";
import AudioFeedBackService from "../services/AudioFeedBack.service";
class AudioFeedBackController {
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findMany(request: Request, response: Response, next: Function) {
    AudioFeedBackService.findMany(request.body, [], [])
      .then((result: AudioFeedBack[]) => response.send(result))
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
  static findById(request: Request, response: Response, next: Function) {
    AudioFeedBackService.findOne({ id: request.params.id }, [], [])
      .then((FeedBack: AudioFeedBack) => response.send(FeedBack))
      .catch((error: any) => next(error));
  }

  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static create(request: Request, response: Response, next: Function) {
    console.log("Request Body  ", request.file);

    const currentYear = new Date().getFullYear();
    let file_path = ImagePathResolver(request.file);
    if (!file_path) {
      return next(new BadRequestError(["File path is not defined"]));
    }
    let file_name = file_path.split("\\")[1];
    AudioFeedBackService.create({
      file_name: file_name,
      file_path: file_path,
      name: request.body.name,
      phone: request.body.phone,
    })
      .then((result: AudioFeedBack) => response.send(result))
      .catch((error: any) => next(new BadRequestError(error)));
  }
  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static update(request: Request, response: Response, next: Function) {
    const currentYear = new Date().getFullYear();
    AudioFeedBackService.update({ id: request.params.id }, request.body)
      .then((result: AudioFeedBack) => response.send(result))
      .catch((error: any) => next(new BadRequestError(error)));
  }
  static findManyPaginate(
    request: Request,
    response: Response,
    next: Function
  ) {
    let query: any[] = [];
    let page: number = _.toNumber(request.query.page) || 1;
    let limit: number = _.toNumber(request.query.limit) || 10;
    AudioFeedBackService.findManyPaginate(
      query,
      [["created_date", "DESC"]],
      page,
      limit
    )
      .then((compliment: any) => response.send(compliment))
      .catch((error: any) => next(error));
  }
}

export default AudioFeedBackController;
