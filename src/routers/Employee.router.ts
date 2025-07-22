import { Application, Router } from "express";
import EmployeeController from "../controllers/Employee.controller";
import upload from "../middlewares/upload/UploadImage";

let router: Router = Router();
router
  .post("/create", EmployeeController.create)
  .get("/", EmployeeController.findMany)
  .get("/postion", EmployeeController.getPositions)
  .get("/paginate", EmployeeController.findManyPaginate)
  .post(
    "/changProfile/:id",
    upload.single("image"),
    EmployeeController.updateProfile
  )
  .get("/:id", EmployeeController.findById)
  .put("/:id", EmployeeController.update);

export default router;
