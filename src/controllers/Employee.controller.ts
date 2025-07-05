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
import { Employee } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import EmployeeService from "../services/Employee.service";
import { request } from "http";
import { ImagePathResolver } from "../helpers/upload/PathResolver";
class EmployeeController {
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
    EmployeeService.findMany(request.body, [], [])
        .then((result: Employee[]) => response.send(result))
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
    EmployeeService.findOne({id:request.params.id}, [], [])
        .then((Employee:Employee)=>{
          response.send(Employee)
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
    next: Function){
        const currentYear = new Date().getFullYear();
        EmployeeService.create({
            amharic_name: request.body.amharic_name,
            oromic_name:  request.body.oromic_name,
            oromic_position:  request.body.oromic_position,
            path:  request.body.path,
            position:  request.body.position,
            office:  request.body.office
        })
          .then((result: Employee) => response.send(result))
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
        EmployeeService.update({id:request.params.id},request.body)
          .then((result: Employee) => response.send(result))
          .catch((error: any) => next(new BadRequestError(error)));
  }
  static updateProfile(request: Request,
    response: Response,
    next: Function){
      let path:string='';
      if(request.file){
        path=ImagePathResolver(request.file)
      }
      console.log("Employee Update",path)
      EmployeeService.update({id:request.params.id},{path:path})
          .then((result: Employee) => response.send(result))
          .catch((error: any) => next(new BadRequestError(error)));
  }
  static findManyPaginate(
    request: Request,
    response: Response,
    next: Function,
  ) {
    let query={};
    let search = request.query.search;
    console.log("REQUEST QUERY ",request.query)
    if (request.query.search) {
      query =
      {
        oromic_name: { [Op.like]: `%${request.query.search}%` }
        }
    }
    let page:number = _.toNumber(request.query.page) || 1;
    let limit:number = _.toNumber(request.query.limit) || 10;
    EmployeeService.findManyPaginate(query,[],page,limit)
        .then((compliment:any)=>response.send(compliment))
        .catch((error: any) => next(error));
  }

}

export default EmployeeController;
