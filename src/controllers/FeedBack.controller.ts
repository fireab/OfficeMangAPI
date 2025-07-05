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
import { Employee, FeedBack } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import { request } from "http";
import { ImagePathResolver } from "../helpers/upload/PathResolver";
import FeedBackService from "../services/FeedBack.service";
class FeedBackController {
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
  ) {
    FeedBackService.findMany(request.body, [], [])
        .then((result: FeedBack[]) => response.send(result))
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
  static findById(
    request: Request,
    response: Response,
    next: Function,
  ) {
    FeedBackService.findOne({id:request.params.id}, [], [])
        .then((FeedBack:FeedBack)=>response.send(FeedBack))
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
    next: Function){
        const currentYear = new Date().getFullYear();
        FeedBackService.create({
            type: request.body.feedbackType,
            content:request.body.content, 
            name:request.body.name,
            email: request.body.email,
            phone: request.body.phone
        })
          .then((result: FeedBack) => response.send(result))
          .catch((error: any) => next(new BadRequestError(error)));
  }
  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static update(request: Request,
    response: Response,
    next: Function){
        const currentYear = new Date().getFullYear();
        FeedBackService.update({id:request.params.id},request.body)
          .then((result: FeedBack) => response.send(result))
          .catch((error: any) => next(new BadRequestError(error)));
  }
  static updateProfile(request: Request,
    response: Response,
    next: Function){
      let path:string='';
      if(request.file){
        path=ImagePathResolver(request.file)
      }
      console.log("FeedBack Update",path)
      FeedBackService.update({id:request.params.id},{path:path})
          .then((result: FeedBack) => response.send(result))
          .catch((error: any) => next(new BadRequestError(error)));
  }
  static findManyPaginate(
    request: Request,
    response: Response,
    next: Function,
  ) {
    let query:any[]=[];
    let page:number = _.toNumber(request.query.page) || 1;
    let limit:number = _.toNumber(request.query.limit) || 10;
    FeedBackService.findManyPaginate(query,[["created_date","DESC"]],page,limit)
        .then((compliment:any)=>response.send(compliment))
        .catch((error: any) => next(error));
  }

}

export default FeedBackController;
