import { Application,Router } from "express";
import UserController from "../controllers/User.controller";
import passport from "passport";
import { PassportJWTStrategy } from "../helpers/security/Strategy";

let router :Router= Router();;
router.post("/create",UserController.create)
    .get("/",
        // passport.authenticate("jwt", { session: false }),
        UserController.findMany)
    .get("/profile",
    passport.authenticate("jwt", { session: false }),
    UserController.profile
    )
    .put("/profile",
        passport.authenticate("jwt", { session: false }),
        UserController.profile
        )
    .put("/password",
        passport.authenticate("jwt", { session: false }),
        UserController.update
        )
    .get("/:id", UserController.findById)
    .delete("/:id", UserController.deleteUser)
    .put("/:id",UserController.update)
export default router;