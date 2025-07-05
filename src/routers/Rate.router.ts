import { Application,Router } from "express";
import RateController from "../controllers/Rate.controller";

let router :Router= Router();
router
    .post("/",RateController.create)
    // .post("/all",RateController.rateAll)
    .get("/",RateController.findMany)
    // .get("/fetchAllRate",RateController.fetchAllRate)
    .get("/employee_feedback",RateController.findEmployeeRate)
    .get("/paginate",RateController.findManyPaginate)
    .get("/:id",RateController.findById)
    .put("/:id",RateController.update)
export default router;