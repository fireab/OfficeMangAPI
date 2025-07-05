import { Op } from "sequelize";
import _ from "lodash";
import async from "async";
import config from "config";
import { Request, Response } from "express";
import {
  Error,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/Errors";
import { Employee, Rate } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import RateService from "../services/Rate.service";
import { request } from "http";
import { findFeedBack } from "../helpers/constants/FeedBack.constant";
import XLSX from "xlsx";

class RateController {
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findMany(request: Request, response: Response, next: Function) {
    let query = {};
    let dateFilter = (request.query.dateFilter as string) || "all";
    let EmployeeId = request.query.EmployeeId || null;
    if (EmployeeId && EmployeeId.toString().toLocaleLowerCase() !== "all") {
      query = { ...query, EmployeeId: EmployeeId };
    }
    // Add date range filter
    if (dateFilter === "7") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (dateFilter === "30") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (dateFilter === "60") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (dateFilter === "90") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      };
    }
    RateService.findMany(query, [], [{ model: Employee }])
      .then((rates: Rate[]) => {
        console.log("Rate Length ", rates.length);
        const jsonData = rates.map((rate: Rate) => ({
          ID: rate.id,
          "ደንበኛ አቀባበል": rate.CustomerService,
          "በስታንዳርዱ አገልግሎት መስጠት ": rate.StandardService,
          "ትክክለኛ አገልጎት መስጠት ": rate.FairService,
          "ግልጽ መልስ ለ ጥያከዎ መስጠት": rate.ResponseForCompliment,
          "አጠቃላይ አገልግሎት": rate.ServiceRate,
          ሰራተኛ: rate.employee.amharic_name || "",
          አመት: rate.year,
          "አስተያየት ሰጪ": rate.name,
          ስልክ: rate.phone,
        }));
        // Generate a worksheet
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Compliments");
        // Write the workbook to a buffer
        const excelBuffer = XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        });
        // Set headers for downloading the file
        response.setHeader(
          "Content-Disposition",
          'attachment; filename="compliments.xlsx"'
        );
        response.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        // Send the buffer as a response
        response.send(excelBuffer);
      })
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
    RateService.findOne({ id: request.params.id }, [], [])
      .then((Rate: Rate) => response.send(Rate))
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
  static findEmployeeRate(
    request: Request,
    response: Response,
    next: Function
  ) {
    let employee_id: string = request.body.employee_id;
    if (employee_id) {
      RateService.findOne({ EmployeeId: employee_id }, [], [])
        .then((Feedback: Rate) => response.send(Feedback))
        .catch((error: any) => next(error));
    } else {
      next(new BadRequestError(["Employee id required !"]));
    }
  }
  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static create(request: Request, response: Response, next: Function) {
    const currentYear = new Date().getFullYear();
    // console.log("Request Body ", _.toNumber(request.body.EmployeeId));

    RateService.create({
      CustomerService: findFeedBack(request.body.CustomerService),
      StandardService: findFeedBack(request.body.StandardService),
      FairService: findFeedBack(request.body.FairService),
      ResponseForCompliment: findFeedBack(request.body.ResponseForCompliment),
      ServiceRate: findFeedBack(request.body.ServiceRate),
      EmployeeId: _.toNumber(request.body.EmployeeId),
      year: currentYear,
      name: request.body.name,
      phone: request.body.phone,
    })
      .then((result: Rate) => response.send(result))
      .catch((error: any) => next(new BadRequestError(error)));
  }
  // static rateAll(request: Request,
  //   response: Response,
  //   next: Function){
  //       const currentYear = new Date().getFullYear();
  //       RateService.rateAll({
  //           ServiceRate: request.body.ServiceRate,
  //           year: currentYear,
  //           name:request.body.name,
  //           phone:request.body.phone
  //       })
  //       .then((result: Feedback) => response.send(result))
  //       .catch((error: any) => next(new BadRequestError(error)));
  // }
  static findManyPaginate(
    request: Request,
    response: Response,
    next: Function
  ) {
    let query = {};
    let dateFilter = (request.query.dateFilter as string) || "all";
    let EmployeeId = request.query.EmployeeId || null;
    let page: number = _.toNumber(request.query.page) || 1;
    let limit: number = _.toNumber(request.query.limit) || 25;
    if (EmployeeId && EmployeeId.toString().toLocaleLowerCase() !== "all") {
      query = { ...query, EmployeeId: EmployeeId };
    }
    // Add date range filter
    if (dateFilter === "7") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (dateFilter === "30") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (dateFilter === "60") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (dateFilter === "90") {
      query = {
        ...query,
        created_date: {
          [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      };
    }
    RateService.findManyPaginate(query, [], page, limit)
      .then((compliment: any) => {
        response.send(compliment);
      })
      .catch((error: any) => next(error));
  }
  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static update(request: Request, response: Response, next: Function) {
    RateService.update({ id: request.params.id }, request.body)
      .then((result: Rate) => response.send(result))
      .catch((error: any) => next(new InternalServerError(error)));
  }
  // static fetchAllRate(request: Request,
  //   response: Response,
  //   next: Function){
  //     FeedbackService.fetchAllRate()
  //   .then((result: Rate[]) => response.send(result))
  //   .catch((error: any) => next(new InternalServerError(error)));
  // }
}

export default RateController;
