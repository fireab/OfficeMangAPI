import { Application,Router } from "express";
import ComplimentController from "../controllers/Compilment.controller";
let router :Router= Router();
    router.post("/",ComplimentController.create)
        .get("/",ComplimentController.findMany)
        .get("/paginate",ComplimentController.findManyPaginate)
        .get("/:id",ComplimentController.findById)
        .put("/:id",ComplimentController.update)
export default router;