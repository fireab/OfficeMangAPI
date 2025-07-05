import { Application,Router } from "express";
import FeedbackController from "../controllers/Rate.controller";
import { StatisticsController } from "../controllers/Statistics.controller";

let router :Router= Router();
router
    .post("/",StatisticsController.findInGroup)
    .get("/employee/:id",StatisticsController.findFeedBackForEmployee)
    .post("/total",StatisticsController.total)
    .get("/average",StatisticsController.totalRateAverageInYear)
    .get("/rate_branch",StatisticsController.customerRateTheBranch)
    .get("/employee_average_list",StatisticsController.employeeTotalRates)
    .get("/find_top/extract",StatisticsController.exportEmployeeRanks)
    .get("/find_top_10",StatisticsController.findTopRatedEmployees)
    .get("/findTopRatedEmployeesInMonth",StatisticsController.findTopRatedEmployeesInMonth);

export default router;