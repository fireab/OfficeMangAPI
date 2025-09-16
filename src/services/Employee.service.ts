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
import { Employee } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import { Position } from "../models/position.mode";
class EmployeeService {
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
  ): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        where: query,
        order: order,
        include: includes,
      })
        .then((result: Employee[]) => resolve(result))
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
  ): Promise<Employee> {
    return new Promise((resolve, reject) => {
      Employee.findOne({
        where: query,
        include: includes,
      })
        .then((result: Employee) => {
          if (!result) {
            reject(new BadRequestError([{ messages: "EmployeeNot Found" }]));
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
      amharic_name: string;
      oromic_name: string;
      oromic_position: string;
      path: string | null;
      position: string;
      office: string;
    },
    transaction?: Transaction
  ): Promise<Employee> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            Employee.create(body)
              .then((result: Employee) => resolve(result))
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
      console.log("Find MANY Paginate", query);
      let count: number = await Employee.count({ where: query });
      Employee.findAll({
        where: query,
        include: ["position"],
        limit: limit,
        offset: (page - 1) * limit,
        order: order,
      })
        .then((result: Employee[]) =>
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
  ): Promise<Employee> {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            this.findOne(query, [], [])
              .then((employee) => done(null, employee))
              .catch((error: Error) => done(error));
          },
          (employee: Employee, done: Function) => {
            delete body.id;
            employee
              .update(body)
              .then((result: Employee) => resolve(result))
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
  static async simpleUpdate(query: any, body: any): Promise<any> {
    console.log("xxxxxxxxxxxxxxxxxx");

    // let res = await Employee.findOne({ where: query });
    console.log("yyyyyyyyyyyyyyyyyyyyyy");

    // if (!res) {
    //   throw new BadRequestError([{ messages: "Employee Not Found" }]);
    // }
    console.log("pleaseeeeeee");

    const result = await Employee.update(body, { where: query });
    return "result";
  }

  static async handleAssign(data: any[]): Promise<{ message: string }> {
    try {
      for (const d of data) {
        const service_id = d.service_id;
        const employee_ids = d.employee_ids;

        for (const empId of employee_ids) {
          const emp = await Employee.findOne({ where: { id: empId } });
          if (emp) {
            emp.service_id = service_id;
            await emp.save();
          } else {
            console.warn(`Employee with id ${empId} not found.`);
          }
        }
      }

      return {
        message:
          "All employees have been successfully assigned to their services.",
      };
    } catch (error) {
      console.error("Error assigning employees to services:", error);
      throw new BadRequestError(["Failed to assign employees to services."]);
    }
  }

  static async getPostion() {
    const position = await Position.findAll({});
    return position;
  }
}
export default EmployeeService;
