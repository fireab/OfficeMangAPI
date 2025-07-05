import { Application,Router } from "express";
import FeedBackController from "../controllers/FeedBack.controller";
import {uploadAudio} from ".././middlewares/upload/UploadImage";
import AudioFeedBackController from ".././controllers/AudioFeedBack.controller";
let router :Router= Router();
    router.post("/",FeedBackController.create)
    .get("/",FeedBackController.findMany)
    .post("/file",uploadAudio.single("audio"),AudioFeedBackController.create)
    .get("/paginate",FeedBackController.findManyPaginate)
    .get("/:id",FeedBackController.findById)
    .put("/:id",FeedBackController.update)
export default router;