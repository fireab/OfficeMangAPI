import { Application, Router } from "express";
import FeedBackController from "../controllers/FeedBack.controller";
import { uploadAudio } from ".././middlewares/upload/UploadImage";
import AudioFeedBackController from ".././controllers/AudioFeedBack.controller";
let router: Router = Router();
router
  .post("/", AudioFeedBackController.create)
  .get("/", AudioFeedBackController.findMany)
  .get("/paginate", AudioFeedBackController.findManyPaginate)
  .get("/:id", AudioFeedBackController.findById)
  .put("/:id", AudioFeedBackController.update);
export default router;
