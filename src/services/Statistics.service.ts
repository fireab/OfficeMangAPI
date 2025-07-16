import { Op, QueryTypes, where } from "sequelize";
import _, { reject, result } from "lodash";
import async from "async";
import config from "config";

import {
  Error,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/Errors";
import { Employee, Rate, sequelize } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import { resolve } from "path";
import { response } from "express";
import {
  calculateAverageRating,
  getTop10ByAverage,
} from "../helpers/averageCalculator";
import { Position } from "../models/position.mode";
export interface Ratee {
  CustomerService: number | null;
  Excellent: number | null;
  Intermediate: number | null;
  VeryGood: number | null;
  Good: number | null;
  Bad: number | null;
}
class StatisticsService {
  static findTopRatedEmployees(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const results = Rate.findAll({
        attributes: [
          "EmployeeId",
          [
            sequelize.literal(`
                      AVG(
                        CASE CustomerService
                          WHEN 'Excellent' THEN 4
                          WHEN 'VeryGood' THEN 3
                          WHEN 'Intermediate' THEN 2
                          WHEN 'Good' THEN 1
                          WHEN 'Bad' THEN -1
                          ELSE 0
                        END +
                        CASE StandardService
                          WHEN 'Excellent' THEN 4
                          WHEN 'VeryGood' THEN 3
                          WHEN 'Intermediate' THEN 2
                          WHEN 'Good' THEN 1
                          WHEN 'Bad' THEN -1
                          ELSE 0
                        END +
                        CASE FairService
                          WHEN 'Excellent' THEN 4
                          WHEN 'VeryGood' THEN 3
                          WHEN 'Intermediate' THEN 2
                          WHEN 'Good' THEN 1
                          WHEN 'Bad' THEN -1
                          ELSE 0
                        END +
                        CASE ResponseForCompliment
                          WHEN 'Excellent' THEN 4
                          WHEN 'VeryGood' THEN 3
                          WHEN 'Intermediate' THEN 2
                          WHEN 'Good' THEN 1
                          WHEN 'Bad' THEN -1
                          ELSE 0
                        END +
                        CASE ServiceRate
                          WHEN 'Excellent' THEN 4
                          WHEN 'VeryGood' THEN 3
                          WHEN 'Intermediate' THEN 2
                          WHEN 'Good' THEN 1
                          WHEN 'Bad' THEN -1
                          ELSE 0
                        END
                      ) / 5
                    `),
            "averageScore",
          ],
        ],
        group: ["EmployeeId"],
        order: [
          [sequelize.literal("averageScore"), "DESC"], // Order by average score
          ["EmployeeId", "ASC"], // Secondary order to handle ties
        ],
        where: query,
        include: [
          {
            model: Employee,
            include: [
              {
                model: Position,
              },
            ],
          },
        ],
      });
      console.log("Result ", result);
      resolve(results);
    });
  }
  static findAllRateInNumber(year?: number): Promise<{
    CustomerService: Ratee;
    StandardService: Ratee;
    FairService: Ratee;
    ResponseForCompliment: Ratee;
    ServiceRate: Ratee;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        year = year ? year : new Date().getFullYear();

        const groupedCustomerService = await Rate.findAll({
          where: { year: year },
          attributes: [
            [sequelize.col("CustomerService"), "type"],
            "year",
            [sequelize.fn("COUNT", sequelize.col("CustomerService")), "count"],
          ],
          group: ["CustomerService"],
          raw: true,
        });
        const groupedStandardService = await Rate.findAll({
          where: { year: year },
          attributes: [
            [sequelize.col("StandardService"), "type"],
            "year",
            [sequelize.fn("COUNT", sequelize.col("StandardService")), "count"],
          ],
          group: ["StandardService"],
          raw: true,
        });
        const groupedFairService = await Rate.findAll({
          where: { year: year },
          attributes: [
            [sequelize.col("FairService"), "type"],
            "year",
            [sequelize.fn("COUNT", sequelize.col("FairService")), "count"],
          ],
          group: ["FairService"],
          raw: true,
        });
        const groupedResponseForCompliment = await Rate.findAll({
          where: { year: year },
          attributes: [
            [sequelize.col("ResponseForCompliment"), "type"],
            "year",
            [
              sequelize.fn("COUNT", sequelize.col("ResponseForCompliment")),
              "count",
            ],
          ],
          group: ["ResponseForCompliment"],
          raw: true,
        });
        const groupedServiceRate = await Rate.findAll({
          where: { year: year },
          attributes: [
            [sequelize.col("ServiceRate"), "type"],
            "year",
            [sequelize.fn("COUNT", sequelize.col("ServiceRate")), "count"],
          ],
          group: ["ServiceRate"],
          raw: true,
        });

        resolve({
          CustomerService: this.transformArrayToObject(groupedCustomerService),
          StandardService: this.transformArrayToObject(groupedStandardService),
          FairService: this.transformArrayToObject(groupedFairService),
          ResponseForCompliment: this.transformArrayToObject(
            groupedResponseForCompliment
          ),
          ServiceRate: this.transformArrayToObject(groupedServiceRate),
        });
        // console.log(groupedCustomerService);
      } catch (error) {
        console.error("Error fetching grouped CustomerService:", error);
        reject(error);
      }
    });
  }
  static findAllRateInNumberForEmployee(query: any, year?: number) {
    return new Promise(async (resolve, reject) => {
      try {
        year = year ? year : new Date().getFullYear();
        type ServiceCount = {
          Bad: number | null;
          Good: number | null;
          VeryGood: number | null;
          Excellent: number | null;
        };
        console.log("Employee_id", query);
        let groupedCustomerService = await this.groupFinder(
          "CustomerService",
          year,
          query
        );
        let groupedStandardService = await this.groupFinder(
          "StandardService",
          year,
          query
        );
        let groupedFairService = await this.groupFinder(
          "FairService",
          year,
          query
        );
        let groupedResponseForCompliment = await this.groupFinder(
          "ResponseForCompliment",
          year,
          query
        );
        let groupedServiceRate = await await this.groupFinder(
          "ServiceRate",
          year,
          query
        );

        let CustomerService: ServiceCount = this.transformArrayToObject(
          groupedCustomerService
        );
        let StandardService: ServiceCount = this.transformArrayToObject(
          groupedStandardService
        );
        let FairService: ServiceCount =
          this.transformArrayToObject(groupedFairService);
        let ResponseForCompliment: ServiceCount = this.transformArrayToObject(
          groupedResponseForCompliment
        );
        let ServiceRate: ServiceCount =
          this.transformArrayToObject(groupedServiceRate);
        resolve({
          CustomerService: CustomerService,
          StandardService: StandardService,
          FairService: FairService,
          ResponseForCompliment: ResponseForCompliment,
          ServiceRate: ServiceRate,
        });
        console.log(groupedCustomerService);
      } catch (error) {
        console.error("Error fetching grouped CustomerService:", error);
        reject(error);
      }
    });
  }
  static transformArrayToObject(responseForCompliment: any) {
    if (responseForCompliment && responseForCompliment.length != 0) {
      return responseForCompliment.reduce((acc: any, curr: any) => {
        acc[curr.type] = curr.count;
        return acc;
      }, {});
    } else {
      return null;
    }
  }
  static async groupFinder(rate_type: string, year: number, query?: any) {
    let data = await Rate.findAll({
      where: { ...query, year: year },
      attributes: [
        [sequelize.col(rate_type), "type"],
        "year",
        [sequelize.fn("COUNT", sequelize.col(rate_type)), "count"],
      ],
      group: [rate_type],
      raw: true,
    });
    return data;
  }
  static customerRateTheBranch(year: number): Promise<any> {
    let mysql_query = `
        SELECT 

            SUM(CASE WHEN ServiceRate = 'Excellent' THEN 1 ELSE 0 END) AS Excellent,
            SUM(CASE WHEN ServiceRate = 'VeryGood' THEN 1 ELSE 0 END) AS VeryGood,
            SUM(CASE WHEN ServiceRate = 'Good' THEN 1 ELSE 0 END) AS Good,
            SUM(CASE WHEN ServiceRate = 'Bad' THEN 1 ELSE 0 END) AS Bad
        FROM 
            rates;`;
    return new Promise((resolve, reject) => {
      sequelize
        .query(mysql_query)
        .then((response) => {
          resolve(response[0][0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  static employeeAverage(year: number): Promise<any> {
    return new Promise((resolve, reject) => {
      sequelize
        .query(
          `
    SELECT 
      e.id,
      e.amharic_name,
      e.path,
      SUM(CASE WHEN f.CustomerService = 'Excellent' THEN 1 ELSE 0 END) AS CustomerService_Excellent,
        SUM(CASE WHEN f.CustomerService = 'VeryGood' THEN 1 ELSE 0 END) AS CustomerService_VeryGood,
        SUM(CASE WHEN f.CustomerService = 'Good' THEN 1 ELSE 0 END) AS CustomerService_Good,
        SUM(CASE WHEN f.CustomerService = 'Bad' THEN 1 ELSE 0 END) AS CustomerService_Bad,
        
        SUM(CASE WHEN f.StandardService = 'Excellent' THEN 1 ELSE 0 END) AS StandardService_Excellent,
        SUM(CASE WHEN f.StandardService = 'VeryGood' THEN 1 ELSE 0 END) AS StandardService_VeryGood,
        SUM(CASE WHEN f.StandardService = 'Good' THEN 1 ELSE 0 END) AS StandardService_Good,
        SUM(CASE WHEN f.StandardService = 'Bad' THEN 1 ELSE 0 END) AS StandardService_Bad,

        SUM(CASE WHEN f.FairService = 'Excellent' THEN 1 ELSE 0 END) AS FairService_Excellent,
        SUM(CASE WHEN f.FairService = 'VeryGood' THEN 1 ELSE 0 END) AS FairService_VeryGood,
        SUM(CASE WHEN f.FairService = 'Good' THEN 1 ELSE 0 END) AS FairService_Good,
        SUM(CASE WHEN f.FairService = 'Bad' THEN 1 ELSE 0 END) AS FairService_Bad,

        SUM(CASE WHEN f.ResponseForCompliment = 'Excellent' THEN 1 ELSE 0 END) AS ResponseForCompliment_Excellent,
        SUM(CASE WHEN f.ResponseForCompliment = 'VeryGood' THEN 1 ELSE 0 END) AS ResponseForCompliment_VeryGood,
        SUM(CASE WHEN f.ResponseForCompliment = 'Good' THEN 1 ELSE 0 END) AS ResponseForCompliment_Good,
        SUM(CASE WHEN f.ResponseForCompliment = 'Bad' THEN 1 ELSE 0 END) AS ResponseForCompliment_Bad,

        SUM(CASE WHEN f.ServiceRate = 'Excellent' THEN 1 ELSE 0 END) AS ServiceRate_Excellent,
        SUM(CASE WHEN f.ServiceRate = 'VeryGood' THEN 1 ELSE 0 END) AS ServiceRate_VeryGood,
        SUM(CASE WHEN f.ServiceRate = 'Good' THEN 1 ELSE 0 END) AS ServiceRate_Good,
        SUM(CASE WHEN f.ServiceRate = 'Bad' THEN 1 ELSE 0 END) AS ServiceRate_Bad

    FROM employees e
    LEFT JOIN rates f ON e.id = f.EmployeeId
    GROUP BY e.id;
  `,
          { type: QueryTypes.SELECT }
        )
        .then((results: any) => {
          console.log(results);
          let data: {
            EmployeeId: number;
            average: number;
            amharic_name: string;
            path: string;
          }[] = [];
          for (let index = 0; index < results.length; index++) {
            const average = calculateAverageRating(results[index]);
            data.push({
              EmployeeId: results[index].id,
              average: average,
              amharic_name: results[index].amharic_name,
              path: results[index].path,
            });
          }
          let sorted_average = getTop10ByAverage(data);
          resolve(sorted_average);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }
}
export default StatisticsService;
