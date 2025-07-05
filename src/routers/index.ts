import { Application } from "express";
import UserRouter from "./User.router";
import ComplimentRouter from "./Compilment.router";
import RateRouter from "./Rate.router";
import EmployeeRouter from "./Employee.router";
import LoginRouter from "./Login.router";
import StatisticsRouter from "./Statistics.router";
import FeedBackRouter from "./FeedBack.router";
import AudioFeedBackRouter from "./AudioFeedback.router";
let routes = (app: Application) => {
  app.use("/user",UserRouter);
  app.use("/compliment",ComplimentRouter);
  app.use("/rate",RateRouter );
  app.use("/feedback", FeedBackRouter);
  app.use("/audio_feedback", AudioFeedBackRouter);
  app.use("/employee", EmployeeRouter);
  app.use("/login", LoginRouter);
  app.use("/stat", StatisticsRouter);
};

export default routes;
