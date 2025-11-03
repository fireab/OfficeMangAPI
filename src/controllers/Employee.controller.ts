import { Op } from "sequelize";
import _ from "lodash";
import async from "async";
import config from "config";
import { NextFunction, Request, Response } from "express";
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
  static findMany(request: Request, response: Response, next: Function) {
    EmployeeService.findMany(request.body, [], ["position"])
      .then((result: Employee[]) => {
        function transformEmployees(employees: any[]) {
          return employees.map((emp) => {
            let teamId: number | null = 0;

            if (emp.position?.parent_id && emp.position.parent_id !== 0) {
              const parentEmp = employees.find(
                (e) => e.position_id === emp.position.parent_id
              );

              teamId = parentEmp ? parentEmp.id : 0;
            }

            return {
              id: emp.id,
              amharic_name: emp.amharic_name,
              oromic_name: emp.oromic_name,
              english_name: emp.english_name,
              oromic_position: emp.position?.name_or || null,
              position: emp.position?.name_am || null,
              english_position: emp.position?.name_en || null,
              path: emp.path,
              office: emp.office,
              team_id: teamId,
              is_director: emp.is_director,
              has_sub: emp.position?.has_sub,
              service_id: emp.service_id,
            };
          });
        }

        // change to to proper json the result first
        let res = result.map((item: Employee) => {
          const plain = item.toJSON(); // convert Sequelize model to plain JSON
          return plain;
        });

        const transormData = transformEmployees(res);

        response.send(transormData);
      })
      .catch((error: any) => next(error));
  }

  static findManyOrdered(request: Request, response: Response, next: Function) {
    EmployeeService.findMany(request.body, [], ["position"])
      .then((result: Employee[]) => {
        function transformEmployees(employees: any[]) {
          return employees.map((emp) => {
            let teamId: number | null = 0;

            if (emp.position?.parent_id && emp.position.parent_id !== 0) {
              const parentEmp = employees.find(
                (e) => e.position_id === emp.position.parent_id
              );

              teamId = parentEmp ? parentEmp.id : 0;
            }

            return {
              id: emp.id,
              name: emp.amharic_name,
              // oromic_name: emp.oromic_name,
              // english_name: emp.english_name,
              // oromic_position: emp.position?.name_or || null,
              position: emp.position?.name_am || null,
              english_position: emp.position?.name_en || null,
              avatar: `http://192.168.1.13:2000/public/${emp.path}`,
              // office: emp.office,
              office: emp.office,
              team_id: teamId,
              is_director: emp.is_director,
              // has_sub: emp.position?.has_sub,
              // service_id: emp.service_id,
            };
          });
        }

        type Person = {
          id: number;
          name: string;
          position: string;
          english_position: string;
          avatar: string;
          office: string;
          team_id: number;
          is_director: boolean | null;
        };

        function sortByTeamAndId(data: Person[]): Person[] {
          return data.sort((a, b) => {
            if (a.team_id === b.team_id) {
              return a.id - b.id; // secondary sort by id
            }
            return a.team_id - b.team_id; // primary sort by team_id
          });
        }

        // change to to proper json the result first
        let res = result.map((item: Employee) => {
          const plain = item.toJSON(); // convert Sequelize model to plain JSON
          return plain;
        });

        const transormData = transformEmployees(res);
        const sortedData = sortByTeamAndId(transormData);
        const selectedEmployees = [];
        selectedEmployees.push(sortedData.filter((data) => data.id === 1));
        selectedEmployees.push(sortedData.filter((data) => data.id === 2));
        selectedEmployees.push(sortedData.filter((data) => data.id === 25));
        selectedEmployees.push(sortedData.filter((data) => data.id === 20));
        selectedEmployees.push(sortedData.filter((data) => data.id === 26));
        selectedEmployees.push(sortedData.filter((data) => data.id === 10));
        selectedEmployees.push(sortedData.filter((data) => data.id === 17));
        selectedEmployees.push(sortedData.filter((data) => data.id === 9));
        selectedEmployees.push(sortedData.filter((data) => data.id === 35));

        selectedEmployees.push(sortedData.filter((data) => data.id === 36));
        selectedEmployees.push(sortedData.filter((data) => data.id === 11));
        selectedEmployees.push(sortedData.filter((data) => data.id === 29));
        selectedEmployees.push(sortedData.filter((data) => data.id === 19));
        selectedEmployees.push(sortedData.filter((data) => data.id === 28));
        selectedEmployees.push(sortedData.filter((data) => data.id === 4));
        selectedEmployees.push(sortedData.filter((data) => data.id === 37));
        selectedEmployees.push(sortedData.filter((data) => data.id === 12));
        selectedEmployees.push(sortedData.filter((data) => data.id === 30));
        selectedEmployees.push(sortedData.filter((data) => data.id === 27));
        selectedEmployees.push(sortedData.filter((data) => data.id === 35));
        selectedEmployees.push(sortedData.filter((data) => data.id === 16));
        selectedEmployees.push(sortedData.filter((data) => data.id === 3));
        selectedEmployees.push(sortedData.filter((data) => data.id === 34));
        selectedEmployees.push(sortedData.filter((data) => data.id === 18));
        selectedEmployees.push(sortedData.filter((data) => data.id === 24));
        selectedEmployees.push(sortedData.filter((data) => data.id === 31));
        selectedEmployees.push(sortedData.filter((data) => data.id === 13));

        // response.send(sortedData);
        response.send(selectedEmployees);
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
    EmployeeService.findOne({ id: request.params.id }, [], ["position"])
      .then((Employee: Employee) => {
        function transformEmployees(employees: any[]) {
          return employees.map((emp) => {
            let teamId: number | null = 0;

            if (emp.position?.parent_id && emp.position.parent_id !== 0) {
              const parentEmp = employees.find(
                (e) => e.position_id === emp.position.parent_id
              );

              teamId = parentEmp ? parentEmp.id : 0;
            }

            return {
              id: emp.id,
              amharic_name: emp.amharic_name,
              oromic_name: emp.oromic_name,
              english_name: emp.english_name,
              oromic_position: emp.position?.name_or || null,
              position: emp.position?.name_am || null,
              english_position: emp.position?.name_en || null,
              path: emp.path,
              office: emp.office,
              team_id: teamId,
              is_director: emp.is_director,
              has_sub: emp.position?.has_sub,
            };
          });
        }

        // change to to proper json the result first
        let res = [Employee].map((item: Employee) => {
          const plain = item.toJSON(); // convert Sequelize model to plain JSON
          return plain;
        });

        const transormData = transformEmployees(res);
        response.send(transormData[0]);
      })
      .catch((error: any) => next(error));
  }

  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static create(request: Request, response: Response, next: Function) {
    const currentYear = new Date().getFullYear();
    EmployeeService.create({
      amharic_name: request.body.amharic_name,
      oromic_name: request.body.oromic_name,
      oromic_position: request.body.oromic_position,
      path: request.body.path,
      position: request.body.position,
      office: request.body.office,
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
  static update(request: Request, response: Response, next: Function) {
    const currentYear = new Date().getFullYear();
    EmployeeService.update({ id: request.params.id }, request.body)
      .then((result: Employee) => response.send(result))
      .catch((error: any) => next(new BadRequestError(error)));
  }
  static updateProfile(request: Request, response: Response, next: Function) {
    let path: string = "";
    console.log("man passed ....");

    if (request.file) {
      path = ImagePathResolver(request.file);
    }
    path = path.split("/").pop();

    EmployeeService.update({ id: request.params.id }, { path: path })
      .then((result: Employee) => response.send(result))
      .catch((error: any) => next(new BadRequestError(error)));
  }
  static findManyPaginate(
    request: Request,
    response: Response,
    next: Function
  ) {
    let query = {};
    let search = request.query.search;
    console.log("REQUEST QUERY ", request.query);
    if (request.query.search) {
      query = {
        oromic_name: { [Op.like]: `%${request.query.search}%` },
      };
    }
    let page: number = _.toNumber(request.query.page) || 1;
    let limit: number = _.toNumber(request.query.limit) || 10;
    EmployeeService.findManyPaginate(query, [], page, limit)
      .then((res: any) => {
        // process the response
        res.data = res.data.map((item: Employee) => {
          const plain = item.toJSON(); // convert Sequelize model to plain JSON

          return {
            id: plain.id,
            amharic_name: plain.amharic_name,
            oromic_name: plain.oromic_name,
            english_name: plain.english_name,
            oromic_position: plain.position?.name_or || null,
            position: plain.position?.name_am || null,
            english_position: plain.position?.name_en || null,
            path: plain.path,
            office: plain.office,
            team_id: plain.team_id,
            is_director: plain.is_director,
          };
        });

        response.send(res);
      })
      .catch((error: any) => next(error));
  }

  static async getPositions(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const positions = await EmployeeService.getPostion();
      response.send(positions);
    } catch (error) {
      next(error);
    }
  }

  static async syncEmp(req: Request, res: Response) {
    let body = [
      {
        service_id: 1,
        employee_ids: [1, 2, 3],
      },
      {
        service_id: 2,
        employee_ids: [4, 5],
      },
    ];
    let result = await EmployeeService.handleAssign(body);
    res.status(200).send(result);
  }
}

export default EmployeeController;
