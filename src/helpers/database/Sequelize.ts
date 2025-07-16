import config from "config";
import { Sequelize } from "sequelize";
// import logger from "../logger/Winston";

// IAM Module
import UserFactory, { User } from "../../models/User.model";
import ComplimentFactory, { Compliment } from "../../models/Compilment.model";
import EmployeeFactory, { Employee } from "../../models/Employee.model";
import RateFactory, { Rate } from "../../models/Rate.model";
import CommentFactory, { Comment } from "../../models/Comment.model";
import FeedBackFactory, { FeedBack } from "../../models/FeedBack.model";
import AudioFeedBackFactory, {
  AudioFeedBack,
} from "../../models/AudioFeedBack.model";
import path from "path";
import PositionFactory, { Position } from "../../models/position.mode";
let sequelize: Sequelize;

/**
 * IAM Module Initialization
 *
 * @param {Sequelize}   sequelize
 * @param {string}      onDelete
 */
const IAMModuleInitalization = (sequelize: Sequelize, onDelete: string) => {
  UserFactory(sequelize);
  ComplimentFactory(sequelize);
  EmployeeFactory(sequelize);
  RateFactory(sequelize);
  CommentFactory(sequelize);
  FeedBackFactory(sequelize);
  AudioFeedBackFactory(sequelize);
  PositionFactory(sequelize);
};
/**
 *
 * @param sequelize
 * @param onDelete
 */

const IAMModuleRelationshipInitialization = (
  sequelize: Sequelize,
  onDelete: string
) => {
  // 1 to many relation between roles and users
  Employee.hasMany(Rate, {
    foreignKey: "EmployeeId",
    onDelete,
  });
  Rate.belongsTo(Employee, {
    foreignKey: "EmployeeId",
    onDelete,
  });

  // 1 to 1 relation between employee and position
  Position.hasMany(Employee, {
    foreignKey: "position_id",
    onDelete,
  });
  Employee.belongsTo(Position, {
    foreignKey: "position_id",
    onDelete,
  });
};

export default async () => {
  let dbHost: string = config.get("database.host");
  let dbName: string = config.get("database.name");
  let dbUser: string = config.get("database.user");
  let dbLogging: boolean = config.get("database.logging");
  let dbPassword: string = config.get("database.password");
  let dbPort: number = parseInt(config.get("database.port"));

  const ON_DELETE = process.env.NODE_ENV === "test" ? "CASCADE" : "RESTRICT";

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 100,
      acquire: 60000,
      // ...
    },
  });
  // sequelize = new Sequelize({
  //   dialect: "sqlite",
  //   storage: path.join(__dirname, "database.sqlite"), // path to your SQLite file
  //   logging: false,
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000,
  //   },
  // });
  IAMModuleInitalization(sequelize, ON_DELETE);
  IAMModuleRelationshipInitialization(sequelize, ON_DELETE);

  sequelize
    .sync({ force: false })
    .then(async () => {
      if (process.env.NODE_ENV === "production") {
        sequelize.sync({ alter: true });
      }
      let total_employees = await Employee.count();
      let total_user = await User.count();
      let total_rate = await Rate.count();
      let total_pos = await Position.count();

      if (total_pos === 0) {
        await Position.bulkCreate(
          allPositions.map((pos) => ({
            id: pos.id,
            name_en: pos.name_en,
            name_am: pos.name_am,
            name_or: pos.name_or,
            parent_id: pos.parent_id,
            has_sub: pos.has_sub,
          }))
        ).catch((err) => {
          console.log("postion bulc create error", err);

          throw err;
        });
      }
      if (total_employees == 0) {
        // if (false) {
        Employee.bulkCreate(
          AllEmployees.map((emp) => {
            return {
              id: emp.id, // Replace with your Sequelize model fields
              amharic_name: emp.amharic_name,
              oromic_name: emp.oromic_name,
              english_name: emp.english_name,
              position_id: emp.position_id,
              office: emp.office,
              path: emp.path,
            };
          })
        )
          .then((data) => {
            console.log("data", data.length);
          })
          .catch((error: any) => {
            console.log("err", error);
          });
      }

      if (total_user == 0) {
        await User.create({
          username: "superadmin",
          password: "test",
          isSuperAdmin: true,
          created_date: new Date(),
          updated_date: new Date(),
        });
      }
      if (total_rate == 0) {
        Rate.create({
          CustomerService: "Excellent",
          StandardService: "Excellent",
          FairService: "Excellent",
          ResponseForCompliment: "Excellent",
          ServiceRate: "Excellent",
          EmployeeId: 1,
          year: 2025,
          name: "Firaol Getachew",
          phone: "0966003807",
        });
      }
      // logger.info("Database Connection has been established successfully.");
    })
    .catch((error: any) => {
      console.log("err", error);
      //   logger.error(`Database connection error: ${error}`);
    });
};

export {
  sequelize,
  Sequelize,
  // IAM Module
  User,
  Compliment,
  // Farmer Module
  Rate,
  Employee,
  Comment,
  FeedBack,
  AudioFeedBack,
};

class Employeez {
  id;
  amharic_name;
  oromic_name;
  english_name;
  position_id;
  path;
  office;
  created_date;
  updated_date;
  constructor(
    id: number,
    amharic_name: string,
    oromic_name: string,
    english_name: string,
    position_id: number,
    path: string,
    office: string,
    created_date = new Date(),
    updated_date = new Date()
  ) {
    this.id = id;
    this.amharic_name = amharic_name;
    this.oromic_name = oromic_name;
    this.english_name = english_name;
    this.path = path;
    this.position_id = position_id;
    this.office = office;
    this.created_date = created_date;
    this.updated_date = updated_date;
  }
  toJSON() {
    return {
      id: this.id,
      amharic_name: this.amharic_name,
      oromic_name: this.oromic_name,
      path: this.path,
      office: this.office,
      created_date: this.created_date,
      updated_date: this.updated_date,
    };
  }
}

class Positionz {
  id;
  name_en;
  name_am;
  name_or;
  parent_id;
  has_sub;
  created_date;
  updated_date;
  constructor(
    id: number,
    name_en: string,
    name_am: string,
    name_or: string,
    parent_id: number,
    has_sub: boolean,
    created_date = new Date(),
    updated_date = new Date()
  ) {
    this.id = id;
    this.name_en = name_en;
    this.name_am = name_am;
    this.name_or = name_or;
    this.parent_id = parent_id;
    this.has_sub = has_sub;
    this.created_date = created_date;
    this.updated_date = updated_date;
  }
  toJSON() {
    return {
      id: this.id,
      name_en: this.name_en,
      name_am: this.name_am,
      name_or: this.name_or,
      parent_id: this.parent_id,
      has_sub: this.has_sub,
      created_date: this.created_date,
      updated_date: this.updated_date,
    };
  }
}
const TopEmployees = [
  new Employeez(
    1,
    "ዲዳ ድሪባ",
    "Dida Diriba",
    "Dida Diriba",
    1,
    "dida_diriba.jpg",
    " B-01   201"
  ),
  new Employeez(
    2,
    "አዱኛ ወንድሙ",
    "Adugna Wendimu",
    "Adugna Wendimu",
    2,
    "adugna_wendimu.jpg",
    "B-01 304"
  ),
  new Employeez(
    3,
    "አንበሳው ፈንቴ",
    "Anbesaw Fente",
    "Anbesaw Fente",
    2,
    "anbesaw_fente.jpg",
    "B-01 104"
  ),
  new Employeez(
    4,
    "አስቴር አድማሱ",
    "Aster Admasu",
    "Aster Admasu",
    3,
    "aster_admasu.jpg",
    "B-02 001"
  ),
  new Employeez(
    5,
    "እህተ ከበደ",
    "Ehte Kebede",
    "Ehte Kebede",
    4,
    "ehte_kebede.jpg",
    "B-02 101"
  ),
];

const AllEmployees = [...TopEmployees];

const allPositions = [
  new Positionz(1, "test one", "test one AM", "", 0, true),
  new Positionz(2, "test two", "test two AM", "", 1, true),
  new Positionz(3, "test three", "test three AM", "", 1, true),
  new Positionz(4, "test four", "test four AM", "", 2, false),
  new Positionz(5, "test five", "test five AM", "", 2, true),
];
