import { Application,Router } from "express";
import UserController from "../controllers/User.controller";
import LoginController from "../controllers/Login.controller";
let router :Router= Router();
router.post("/",LoginController.Login)

export default router;