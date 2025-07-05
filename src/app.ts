import cors from "cors";
import async from "async";
import helmet from "helmet";
import morgan from "morgan";
import moment from "moment";
import passport from "passport";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import session from "express-session";

import routes from "./routers";
import { Error } from "./errors/Errors";
import Messages from "./errors/Messages";
// import logger from "./helpers/logger/Winston";
import { ForeignKeyConstraintError, QueryTypes } from "sequelize";
import UserService from "./services/User.service";
import initializeDB, { Rate, User, sequelize } from "./helpers/database/Sequelize";
import {
  PassportJWTStrategy,
} from "./helpers/security/Strategy";
import path from "path";
import config from "config";
import fs from "fs";
import c from "config";
var ethiopianDate = require('ethiopian-date');
/**
 * Initialize Express App
 */
const app: Application = express();

app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));
/**
 * Passport Initialization
 */
app.use(
  session({
    secret: config.get("security.jwt.secret"),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(PassportJWTStrategy);

passport.serializeUser((user: User, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done: Function) => {
  UserService.findOne({ id: id }, [], [])
    .then((user: User) => done(null, user))
    .catch((error: any) => done(error));
});

/**
 * Middleware
 */
// app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(helmet());

app.use(cors({origin:'*'}));
app.use(morgan("combined"));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use("/public", express.static("public"));

app.use("/audios", express.static("audios"));

/**
 * Morgan Body Logger
 */
morganBody(app, { maxBodyLength: 1000000 });

/**
 * Initialize Database
 */
initializeDB();

/**
 * Initialize Routes
 */
routes(app);

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname,'..', 'uploads', req.params.filename);
  console.log("File Path ",filePath)
  // Check if the file exists
  if (fs.existsSync(filePath)) {
      // Set appropriate headers for binary data
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'inline');
      
      // Stream the file as binary
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
  } else {
      res.status(404).send('File not found');
  }
});
// async function TestFunction(rate_type:string,year:number,query?:any) {


// }
// TestFunction("CustomerService",2024);
/**
 * Health Check Endpoint
 */
app.get("/health-check", async (request: Request, response: Response) => {
  const StatusResponse = {
    database: "Inactive",
  };
  async.waterfall(
    [
      (done: Function) => {
        sequelize
          .authenticate()
          .then(() => {
            StatusResponse.database = "Active";
            done();
          })
          .catch(() => {
            StatusResponse.database = "Inactive";
            done();
          });
      },
    ],
    () => {
      response.status(200).json(StatusResponse);
    }
  );
});

/**
 * Global Error Handler
 */
app.use((error: any, request: Request, response: Response, next: Function) => {
  // logger.error("error: ", error);
  console.log("Error", error);
  if (error instanceof Error) {
    if (error.payload?.errors instanceof ForeignKeyConstraintError) {
      let errors: any = [];
      error.payload?.errors.fields.forEach((element: string) => {
        errors.push({
          field: element,
          message: error.payload?.errors.table + " not found",
        });
      });
      error.payload.errors = errors;
      response.status(error.statusCode).json(error.payload);
    } else {
      response.status(error.statusCode).json(error.payload);
    }
  } else {
    response.status(500).json({
      timestamp: moment(),
      errors: [Messages.INTERNAL_SERVER_ERROR],
    });
  }
});
const displayEthiopiaDate = () => {
  const date=new Date();
  const e_Date=ethiopianDate.toEthiopian(date.getFullYear(),date.getMonth()+1,date.getDate());
  console.log("Ethiopian Date",e_Date);
  const current_ethioipian_month=e_Date[1];
  const current_ethioipian_day=e_Date[2];
  const current_ethioipian_year=e_Date[0];
  const start_date=ethiopianDate.toGregorian(current_ethioipian_year,current_ethioipian_month,1);
  const end_date=ethiopianDate.toGregorian(current_ethioipian_year,current_ethioipian_month,30);
  
  const valid_start_date=new Date(start_date[0],start_date[1]-1,start_date[2]);
  const valid_end_date=new Date(end_date[0],end_date[1]-1,end_date[2]);
  console.log("Start Date",start_date);
  console.log("End Date",end_date);
  console.log("Valid Start Date",valid_start_date);
  console.log("Valid End Date",valid_end_date);
}
displayEthiopiaDate();
export default app;
