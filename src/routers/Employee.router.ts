import { Application, Router } from "express";
import EmployeeController from "../controllers/Employee.controller";
import upload from "../middlewares/upload/UploadImage";
import ServiceController from "../controllers/service.controller";
import AdController from "../controllers/Ad.controller";

let router: Router = Router();
router
  .post("/create", EmployeeController.create)
  .get("/", EmployeeController.findMany)
  .get("/sort", EmployeeController.findManyOrdered)

  .get("/service", ServiceController.getAllServices)

  .post("/ad", upload.single("image"), AdController.addAD)
  .get("/ad/", AdController.findAll)
  .delete("/ad/:id", AdController.delete)

  .get("/assign", EmployeeController.syncEmp)
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
