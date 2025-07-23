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

  // sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  //   host: dbHost,
  //   port: dbPort,
  //   dialect: "mysql",
  //   logging: false,
  //   dialectOptions: {
  //     connectTimeout: 60000,
  //   },
  //   pool: {
  //     max: 100,
  //     acquire: 60000,
  //     // ...
  //   },
  // });
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "database.sqlite"), // path to your SQLite file
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
  IAMModuleInitalization(sequelize, ON_DELETE);
  IAMModuleRelationshipInitialization(sequelize, ON_DELETE);

  sequelize
    .sync({ alter: true })
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
    3,
    "anbesaw_fente.jpg",
    "B-01 104"
  ),
  new Employeez(
    4,
    "አስቴር አድማሱ",
    "Aster Admasu",
    "Aster Admasu",
    4,
    "aster_admasu.jpg",
    "B-02 001"
  ),
  new Employeez(
    5,
    "እህተ ከበደ",
    "Ehte Kebede",
    "Ehte Kebede",
    5,
    "ehte_kebede.jpg",
    "B-02 101"
  ),
  new Employeez(
    6,
    "እጅጋየሁ ካሳ",
    "Ejigayehu Kasa",
    "Ejigayehu Kasa",
    6,
    "ejigayehu_kasa.jpg",
    "B-01 101"
  ),
  new Employeez(
    7,
    "እንዳሻው ለገሰ",
    "Endashaw Legesse",
    "Endashaw Legesse",
    7,
    "endashaw_legesse.jpg",
    "B-01 103"
  ),
  new Employeez(
    8,
    "ውባየሁ ግርማ",
    "Wibayehu Girima",
    "Wibayehu Girima",
    8,
    "wibayehu_girima.jpg",
    "B-02 109"
  ),
  new Employeez(
    9,
    "ሃይሉ ጸጋዬ",
    "Haylu Tsegaye",
    "Haylu Tsegaye",
    9,
    "haylu_tsegaye.jpg",
    "B-01 204"
  ),
  new Employeez(
    10,
    "ለሜሳ ጉደታ",
    "Lamisa Gudeta",
    "Lemisa Gudeta",
    10,
    "lemisa_gudeta.jpg",
    "B-01 305"
  ),
  new Employeez(
    11,
    "መላኩ ጋሪ",
    "Malaku Gari",
    "Melaku Gari",
    11,
    "melaku_gari.jpg",
    "B-01 301"
  ),
  new Employeez(
    12,
    "መልካሙ ሰውነት",
    "Malkamu Sawnet",
    "Melkamu Sewnet",
    12,
    "melkamu_sewnet.jpg",
    "B-01 205"
  ),
  new Employeez(
    13,
    "መሰረት ግርማ",
    "Meseret Girma",
    "Meseret Girma",
    13,
    "meseret_girma.jpg",
    "B-01 004"
  ),
  new Employeez(
    14,
    "ሙክታር ሰይድ",
    "Muktar Seyid",
    "Muktar Seyid",
    14,
    "muktar_seyid.jpg",
    "B-01 403"
  ),
  new Employeez(
    15,
    "ነጻነት ሞላ",
    "Netsanet Molla",
    "Netsanet Molla",
    15,
    "netsanet_molla.jpg",
    "B-01 001"
  ),
  new Employeez(
    16,
    "ሳሙኤል ተስፋዬ",
    "Samule Tesfaye",
    "Samuel Tesfaye",
    16,
    "samuel_tesfaye.jpg",
    "B-01 107"
  ),
  new Employeez(
    17,
    "ሰይድ አብድላ",
    "Seyd Abdela",
    "Seyd Abdela",
    17,
    "seyd_abdela.jpg",
    "B-01 305"
  ),
  new Employeez(
    18,
    "ሽመልስ ምትኬ",
    "Shimelis Mitike",
    "Shimelis Mitike",
    18,
    "shimelis_mitike.jpg",
    "B-02 103"
  ),
  new Employeez(
    19,
    "ሰለሞን መለሰ",
    "Solomon Melesse",
    "Solomon Melesse",
    19,
    "solomon_melesse.jpg",
    "B-01 203"
  ),
  new Employeez(
    20,
    "ታድሶ አበባው",
    "Tadso Abebaw",
    "Tadso Abebaw",
    20,
    "tadso_abebaw.jpg",
    "B-01 402"
  ),
  new Employeez(
    21,
    "ቴዎድሮስ ይታገሡ",
    "Tewodros Yitagesu",
    "Tewodros Yitagesu",
    21,
    "tewodros_yitagesu.jpg",
    "B-01 401"
  ),
  new Employeez(
    22,
    "ተመስገን ሁንደራ",
    "Temesgen Hundera",
    "Temesgen Hundera",
    22,
    "temesgen_hundera.jpg",
    "B-01 305"
  ),
  new Employeez(
    23,
    "ተናኜ ነገሰ",
    "Tenagne Negese",
    "Tenagne Negese",
    23,
    "tenagne_negese.jpg",
    "B-01 103"
  ),
  new Employeez(
    24,
    "ተዋበች ገብሬ",
    "Tewabech Gebre",
    "Tewabech Gebre",
    24,
    "tewabech_gebre.jpg",
    "B-01 002"
  ),
  new Employeez(
    25,
    "አሰግደዉ ኃ/ጊዮርጊስ",
    "Assegidew H/Giyorgis",
    "Asegdew H/Giyorgis",
    25,
    "assegidew_h_giyorgis.jpg",
    "B-01 206"
  ),
  new Employeez(
    26,
    "ሙሉቀን ዮናስ",
    "Muluken Yonas",
    "Muluken Yonas",
    26,
    "muluken_yonas.jpg",
    "B-01 303"
  ),
  new Employeez(
    27,
    "አማኑኤር ሽብሩ",
    "Amanuel Shibru",
    "Amanuel Shibru",
    27,
    "amanuel_shibru.jpg",
    "B-01 1  06"
  ),
  new Employeez(
    28,
    "ሰናይት ተስፋዬ",
    "Senayit Tesfaye",
    "Senayit Tesfaye",
    28,
    "senayit_tesfaye.jpg",
    "B-01 304"
  ),
  new Employeez(
    29,
    "ብርክቲ መለሰ",
    "Birkti Melesse",
    "Birkti Melesse",
    29,
    "birkti_melesse.jpg",
    "B-01 203"
  ),
  new Employeez(
    30,
    "ቴዎድሮስ ሽመልሽ",
    "Tewodros Shimelesh",
    "Tewodros Shimelesh",
    30,
    "",
    "B-01 006"
  ),
  new Employeez(
    31,
    "የዉብዳር መለሰ",
    "Yewibdar Melesse",
    "Yewibdar Melesse",
    31,
    "",
    "B-01 103"
  ),
  new Employeez(32, "አለም ሰይድ", "Alem Seyid", "Alem Seyid", 32, "", "B-01 013"),
  new Employeez(
    33,
    "አንበሳዉ ፈንታ",
    "Anbesaw Fenta",
    "Anbesaw Fenta",
    33,
    "",
    "B-02 108"
  ),
  new Employeez(
    34,
    "ዳዊት አባተ",
    "Dawit Abate",
    "Dawit Abate",
    34,
    "",
    "B-02 104"
  ),
];

const AllEmployees = [...TopEmployees];

const allPositions = [
  new Positionz(1, "Manager", "ዋና ስራ አስኪያጅ", "Hoji-geggeessaa", 0, false),
  new Positionz(
    2,
    "Environmental Protection Officer",
    "የአካባቢ ጥበቃ ባለስልጣን አማካሪ",
    "Environmental Protection Officer",
    0,
    false
  ),
  new Positionz(
    3,
    "Environmental Education Team",
    "የአካባቢ ትምህርት ግንዛቤ ቡድን",
    "Garee Hubannoo Barnoota Naannoo",
    0,
    false
  ),
  new Positionz(
    4,
    "Laboratory Section Team",
    "የላቦራቶሪ ክፍል ቡድን",
    "Kutaa Laaboraatoorii",
    0,
    false
  ),
  new Positionz(
    5,
    "Internal Audit Directorate",
    "የውስጥ ኦዲት ዳይሬክቶሬት",
    "Daayirektoreetii Odiitii Keessaa",
    0,
    false
  ),
  new Positionz(
    6,
    "Human Resource Management Directorate",
    "የሰው ኃብት አስተዳደር ዳይሬክቶሬት",
    "Daayirektoreetii Bulchiinsa Humna Namaa",
    0,
    false
  ),
  new Positionz(
    7,
    "Procurement Directorate",
    "ግዥ ዳይሬክቶሬት",
    "Daayirektoreetii Bittaa",
    0,
    false
  ),
  new Positionz(
    8,
    "Planning, Budgeting, Monitoring and Evaluation Directorate",
    "ዕቅድና በጀት ዝግጅት ክትትልና ግምገማ ዳይሬክቶሬት",
    "Ramaddii Karooraa fi Baajata Daayirektoreetii fi gamaaggamaa",
    0,
    false
  ),
  new Positionz(
    9,
    "Directorate of Mining License Management",
    "ማዕድን ፈቃድ አስተዳደር ዳይሬክቶሬት",
    "Daarektoreetii Bulchiinsa Hayyama Albuudaa",
    0,
    false
  ),
  new Positionz(
    10,
    "Environmental Impact Assessment, Legislation and Compliance Directorate",
    "አካባቢ ብክለት ጥናት ህግ ተከባሪነት አካባቢ ተፅዕኖ ግምገማ ዳይሬክቶሬት",
    "Daayirektoreetii Madaallii Dhiibbaa Naannoo, Seera Baasuu fi Ulaagaa",
    0,
    false
  ),
  new Positionz(
    11,
    "Energy Audit and License Team",
    "የኢነርጂ ኦዲት ፍቃድ ቡድን",
    "Garee Odiitii fi Hayyama Annisaa",
    0,
    false
  ),
  new Positionz(
    12,
    "Mining License Management Control Team",
    "የማዕድን ፈቃድ አስተዳደር ቁጥጥር ቡድን",
    "Garee To'annoo Bulchiinsa Hayyama Albuudaa",
    0,
    false
  ),
  new Positionz(
    13,
    "Property and General Service Team",
    "የንብረትና ጠቅላላ አገልግሎት ቡድን",
    "Garee Qabeenyaa fi Tajaajila Waliigalaa",
    0,
    false
  ),
  new Positionz(
    14,
    "Communication Affairs Directorate",
    "የኮምኒኬሽን ጉዳዮች ዳይሬክቶሬት",
    "Daayirektoreetii Dhimmoota Komunikeeshinii",
    0,
    false
  ),
  new Positionz(
    15,
    "Finance Directorate",
    "ፋይናንስ ዳይሬክቶሬት",
    "Daayirektoreetii Faayinaansii",
    0,
    false
  ),
  new Positionz(
    16,
    "Ecosystem and Biodiversity Research and Development Team",
    "የስርዓተ ምህዳርና ብዝሀ ህይወት ጥናትና ምርምር ቡድን",
    "Garee Qorannoo fi Misooma Sirna Ikoo fi Heddummina Lubbu qabeeyyii",
    0,
    false
  ),
  new Positionz(
    17,
    "Director of Climate Change and Alternative Energy Technology",
    "የአየር ንብረት ለውጥና አማራጭ ኢነርጂ ቴክኖሎጂ ዳይሬክተር",
    "Daarektarri Jijjiirama Qilleensaa fi Teeknooloojii Annisaa Filannoo",
    0,
    false
  ),
  new Positionz(
    18,
    "Building Management and Maintenance Service Team",
    "የህንፃ አስተዳደርና ጥገና አገልግሎት ቡድን",
    "Garee Tajaajila Bulchiinsa Gamoo fi Suphaa",
    0,
    false
  ),
  new Positionz(
    19,
    "Heating, Ventilation and Air Conditioning Technology Expansion Team",
    "የሙቀት አማቂ ጋዞችና ልኬት ቅነሳና አረንጓዴ ቴክኖሎጂ ማስፋፋት ቡድን",
    "Garee Babal'ina Teeknooloojii Ho'isaa, Qilleensaa fi Qilleensaa",
    0,
    false
  ),
  new Positionz(
    20,
    "Office Manager",
    "የጽ/ቤት ኃላፊ",
    "Hogganaa waajjira",
    0,
    false
  ),
  new Positionz(
    21,
    "Head of Biodiversity and Ecosystem Management Monitoring and Control Team",
    "የብዝሃ ሕይወትና ስርዓተ ምህዳር ግንዛቤ ክትትልና ቁጥጥር ቡድን መሪ",
    "Hogganaa Garee Hordoffii fi To'annoo Bulchiinsa Heddummina Lubbu qabeeyyii fi Sirna Ikoo Naannoo",
    0,
    false
  ),
  new Positionz(
    22,
    "Ethics and Anti-Corruption Directorate",
    "የስነምግባርና ፀረሙስና ዳይሬክቶሬት",
    "Daayirektoreetii Naamusaa fi Farra Malaammaltummaa",
    0,
    false
  ),
  new Positionz(
    23,
    "Building Management Office Manager",
    "የህንፃ አስተዳደር ጽ/ቤት ኃላፊ",
    "Hogganaa Waajjira Bulchiinsa Gamoo",
    0,
    false
  ),
  new Positionz(
    24,
    "Facility Service Team",
    "የፋሲሊቲ አገልግሎት ቡድን",
    "Garee Tajaajila Faasilitii",
    0,
    false
  ),
  new Positionz(
    25,
    "Deputy Manager / Ecosystem and Mining Management",
    "ምክትል ስራ አስኪያጅ / የስርዓተ ምህዳርና የማዕድን አስተዳደር",
    "Itti Aanaa Hogganaa / Bulchiinsa Sirna Ikoo fi Albuudaa",
    0,
    false
  ),
  new Positionz(
    26,
    "Deputy Manager / Environmental Protection and Climate Change Section",
    "ምክትል ስራ አስኪያጅ / አካባቢ ብክለትና የአየር ንብረት ለውጥ ዘርፍ",
    "Itti Aanaa Hogganaa / Kutaa Eegumsa Naannoo fi Jijjiirama Qilleensaa",
    0,
    false
  ),
  new Positionz(
    27,
    "Forest Resource Utilization Team Leader",
    "የደን ሀብት አጠቃቀም ቡድን መሪ",
    "Hogganaa Garee Itti Fayyadama Qabeenya Bosonaa",
    0,
    false
  ),
  new Positionz(
    28,
    "Environmental Protection and Impact Assessment Control Team",
    "የብክለት ቁጥጥርና የአካባቢ ተፅዕኖ ግምገማ ቡድን",
    "Garee To'annoo Eegumsa Naannoo fi Madaallii Dhiibbaa",
    0,
    false
  ),
  new Positionz(
    29,
    "Climate Change and Planning Implementation Team",
    "አየር ንብረት ለውጥና �ቅድ ዝግጅት ትግበራ ቡድን",
    "Garee Raawwii Jijjiirama Qilleensaa fi Karoora",
    0,
    false
  ),
  new Positionz(
    30,
    "Petroleum and Petroleum Products Quality Assurance Team",
    "የነዳጅና የነዳጅ ውጤቶች ተቋማት ቡቃት ማረጋገጫ ቡድን",
    "Garee Mirkaneessa Qulqullina Oomisha Boba'aa fi Boba'aa",
    0,
    false
  ),
  new Positionz(31, "Procurement Team", "የግዥ ቡድን", "Garee Bittaa", 0, false),
  new Positionz(
    32,
    "Information Technology Directorate",
    "የኢንፎርሜሽን ቴክኖሎጂ ዳይሬክቶሬት",
    "Daayirektoreetii Teeknooloojii Odeeffannoo",
    0,
    false
  ),
  new Positionz(
    33,
    "Change and Good Governance Directorate",
    "የለውጥና መልካም አስተዳደር ዳይሬክቶሬት",
    "Daayirektoreetii Jijjiiramaa fi Bulchiinsa Gaarii",
    0,
    false
  ),
  new Positionz(
    34,
    "Legal Service Team",
    "የህግ �ገልግሎት ቡድን",
    "Garee Tajaajila Seeraa",
    0,
    false
  ),
];
