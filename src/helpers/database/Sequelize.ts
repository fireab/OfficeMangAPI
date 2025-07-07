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
    .sync({ force: true })
    .then(async () => {
      if (process.env.NODE_ENV === "production") {
        sequelize.sync({ alter: true });
      }
      let total_employees = await Employee.count();
      let total_user = await User.count();
      let total_rate = await Rate.count();
      if (total_employees == 0) {
        Employee.bulkCreate(
          AllEmployees.map((emp) => ({
            id: emp.id, // Replace with your Sequelize model fields
            amharic_name: emp.amharic_name,
            oromic_name: emp.oromic_name,
            english_name: emp.english_name,
            position: emp.position,
            oromic_position: emp.oromic_position,
            english_position: emp.english_position,
            office: emp.office,
            path: emp.path,
          }))
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
  position;
  oromic_position;
  english_position;
  path;
  office;
  created_date;
  updated_date;
  constructor(
    id: number,
    amharic_name: string,
    oromic_name: string,
    english_name: string,
    position: string,
    oromic_position: string,
    english_position: string,
    path: string,
    office: string,
    created_date = new Date(),
    updated_date = new Date()
  ) {
    this.id = id;
    this.amharic_name = amharic_name;
    this.oromic_name = oromic_name;
    this.oromic_position = oromic_position;
    this.english_name = english_name;
    this.english_position = english_position;
    this.path = path;
    this.position = position;
    this.office = office;
    this.created_date = created_date;
    this.updated_date = updated_date;
  }
  toJSON() {
    return {
      id: this.id,
      amharic_name: this.amharic_name,
      oromic_name: this.oromic_name,
      oromic_position: this.oromic_position,
      path: this.path,
      position: this.position,
      office: this.office,
      created_date: this.created_date,
      updated_date: this.updated_date,
    };
  }
}
const TopEmployees = [
  //   new Employeez(
  //     1111,
  //     "ፍቅር ደረጄ",
  //     "Fikir Dereje",
  //     "Fiqir Derejje",
  //     "Ogeessa Tajaajila Konkolaataa",
  //     "Fikir.jpg",
  //     "የተሽከርካሪ ፍቃድ አገልግሎት  ባለሞያ",
  //     "",
  //     "Vehicle service expert"
  //   ),
  new Employeez(
    1,
    "ዲዳ ድሪባ",
    "Dida Diriba",
    "Dida Diriba",
    "ዋና ስራ አስኪያጅ",
    "Hoji-geggeessaa",
    "Manager",
    "dida_diriba.jpg",
    " B-01   201"
  ),
  new Employeez(
    2,
    "አዱኛ ወንድሙ",
    "Adugna Wendimu",
    "Adugna Wendimu",
    "የአካባቢ ጥበቃ ባለስልጣን አማካሪ",
    "Environmental Protection Officer",
    "Environmental Protection Officer",
    "adugna_wendimu.jpg",
    "B-01 304"
  ),
  new Employeez(
    3,
    "አንበሳው ፈንቴ",
    "Anbesaw Fente",
    "Anbesaw Fente",
    "የአካባቢ ትምህርት ግንዛቤ ቡድን",
    "Garee Hubannoo Barnoota Naannoo",
    "Environmental Education Team",
    "anbesaw_fente.jpg",
    "B-01 104"
  ),
  new Employeez(
    4,
    "አስቴር አድማሱ",
    "Aster Admasu",
    "Aster Admasu",
    "የላቦራቶሪ ክፍል ቡድን",
    "Kutaa Laaboraatoorii",
    "Laboratory Section Team",
    "aster_admasu.jpg",
    "B-02 001"
  ),
  new Employeez(
    5,
    "እህተ ከበደ",
    "Ehte Kebede",
    "Ehte Kebede",
    "የውስጥ ኦዲት ዳይሬክቶሬት",
    "Daayirektoreetii Odiitii Keessaa",
    "Internal Audit Directorate",
    "ehte_kebede.jpg",
    "B-02 101"
  ),
  new Employeez(
    6,
    "እጅጋየሁ ካሳ",
    "Ejigayehu Kasa",
    "Ejigayehu Kasa",
    "የሰው ኃብት አስተዳደር ዳይሬክቶሬት",
    "Daayirektoreetii Bulchiinsa Humna Namaa",
    "Human Resource Management Directorate",
    "ejigayehu_kasa.jpg",
    "B-01 101"
  ),
  new Employeez(
    7,
    "እንዳሻው ለገሰ",
    "Endashaw Legesse",
    "Endashaw Legesse",
    "ግዥ ዳይሬክቶሬት",
    "Daayirektoreetii Bittaa",
    "Procurement Directorate",
    "endashaw_legesse.jpg",
    "B-01 103"
  ),
  new Employeez(
    8,
    "ውባየሁ ግርማ",
    "Wibayehu Girima",
    "Wibayehu Girima",
    "ዕቅድና በጀት ዝግጅት ክትትልና ግምገማ ዳይሬክቶሬት",
    "Ramaddii Karooraa fi Baajata Daayirektoreetii fi gamaaggamaa",
    "Planning, Budgeting, Monitoring and Evaluation Directorate",
    "wibayehu_girima.jpg",
    "B-02 109"
  ),
  new Employeez(
    9,
    "ሃይሉ ጸጋዬ",
    "Haylu Tsegaye",
    "Haylu Tsegaye",
    "ማዕድን ፈቃድ አስተዳደር ዳይሬክቶሬት",
    "Daarektoreetii Bulchiinsa Hayyama Albuudaa",
    "Directorate of Mining License Management",
    "haylu_tsegaye.jpg",
    "B-01 204"
  ),
  new Employeez(
    10,
    "ለሜሳ ጉደታ",
    "Lamisa Gudeta",
    "Lemisa Gudeta",
    "አካባቢ ብክለት ጥናት ህግ ተከባሪነት አካባቢ ተፅዕኖ ግምገማ ዳይሬክቶሬት",
    "Daayirektoreetii Madaallii Dhiibbaa Naannoo, Seera Baasuu fi Ulaagaa",
    "Environmental Impact Assessment, Legislation and Compliance Directorate",
    "lemisa_gudeta.jpg",
    "B-01 305"
  ),
  new Employeez(
    11,
    "መላኩ ጋሪ",
    "Malaku Gari",
    "Melaku Gari",
    "የኢነርጂ ኦዲት ፍቃድ ቡድን",
    "Garee Odiitii fi Hayyama Annisaa",
    "Energy Audit and License Team",
    "melaku_gari.jpg",
    "B-01 301"
  ),
  new Employeez(
    12,
    "መልካሙ ሰውነት",
    "Malkamu Sawnet",
    "Melkamu Sewnet",
    "የማዕድን ፈቃድ አስተዳደር ቁጥጥር ቡድን",
    "Garee To'annoo Bulchiinsa Hayyama Albuudaa",
    "Mining License Management Control Team",
    "melkamu_sewnet.jpg",
    "B-01 205"
  ),
  new Employeez(
    13,
    "መሰረት ግርማ",
    "Meseret Girma",
    "Meseret Girma",
    "የንብረትና ጠቅላላ አገልግሎት ቡድን",
    "Garee Qabeenyaa fi Tajaajila Waliigalaa",
    "Property and General Service Team",
    "meseret_girma.jpg",
    "B-01 004"
  ),
  new Employeez(
    14,
    "ሙክታር ሰይድ",
    "Muktar Seyid",
    "Muktar Seyid",
    "የኮምኒኬሽን ጉዳዮች ዳይሬክቶሬት",
    "Daayirektoreetii Dhimmoota Komunikeeshinii",
    "Communication Affairs Directorate",
    "muktar_seyid.jpg",
    "B-01 403"
  ),
  new Employeez(
    15,
    "ነጻነት ሞላ",
    "Netsanet Molla",
    "Netsanet Molla",
    "ፋይናንስ ዳይሬክቶሬት",
    "Daayirektoreetii Faayinaansii",
    "Finance Directorate",
    "netsanet_molla.jpg",
    "B-01 001"
  ),
  new Employeez(
    16,
    "ሳሙኤል ተስፋዬ",
    "Samule Tesfaye",
    "Samuel Tesfaye",
    "የስርዓተ ምህዳርና ብዝሀ ህይወት ጥናትና ምርምር ቡድን",
    "Garee Qorannoo fi Misooma Sirna Ikoo fi Heddummina Lubbu qabeeyyii",
    "Ecosystem and Biodiversity Research and Development Team",
    "samuel_tesfaye.jpg",
    "B-01 107"
  ),
  new Employeez(
    17,
    "ሰይድ አብድላ",
    "Seyd Abdela",
    "Seyd Abdela",
    "የአየር ንብረት ለውጥና አማራጭ ኢነርጂ ቴክኖሎጂ ዳይሬክተር",
    "Daarektarri Jijjiirama Qilleensaa fi Teeknooloojii Annisaa Filannoo",
    "Director of Climate Change and Alternative Energy Technology",
    "seyd_abdela.jpg",
    "B-01 305"
  ),
  new Employeez(
    18,
    "ሽመልስ ምትኬ",
    "Shimelis Mitike",
    "Shimelis Mitike",
    "የህንፃ አስተዳደርና ጥገና አገልግሎት ቡድን",
    "Garee Tajaajila Bulchiinsa Gamoo fi Suphaa",
    "Building Management and Maintenance Service Team",
    "shimelis_mitike.jpg",
    "B-02 103"
  ),
  new Employeez(
    19,
    "ሰለሞን መለሰ",
    "Solomon Melesse",
    "Solomon Melesse",
    "የሙቀት አማቂ ጋዞችና ልኬት ቅነሳና አረንጓዴ ቴክኖሎጂ ማስፋፋት ቡድን",
    "Garee Babal'ina Teeknooloojii Ho'isaa, Qilleensaa fi Qilleensaa",
    "Heating, Ventilation and Air Conditioning Technology Expansion Team",
    "solomon_melesse.jpg",
    "B-01 203"
  ),
  new Employeez(
    20,
    "ታድሶ አበባው",
    "Tadso Abebaw",
    "Tadso Abebaw",
    "የጽ/ቤት ኃላፊ",
    "Hogganaa waajjira",
    "Office Manager",
    "tadso_abebaw.jpg",
    "B-01 402"
  ),
  new Employeez(
    21,
    "ቴዎድሮስ ይታገሡ",
    "Tewodros Yitagesu",
    "Tewodros Yitagesu",
    "የብዝሃ ሕይወትና ስርዓተ ምህዳር ግንዛቤ ክትትልና ቁጥጥር ቡድን መሪ",
    "Hogganaa Garee Hordoffii fi To'annoo Bulchiinsa Heddummina Lubbu qabeeyyii fi Sirna Ikoo Naannoo",
    "Head of Biodiversity and Ecosystem Management Monitoring and Control Team",
    "tewodros_yitagesu.jpg",
    "B-01 401"
  ),
  new Employeez(
    22,
    "ተመስገን ሁንደራ",
    "Temesgen Hundera",
    "Temesgen Hundera",
    "የስነምግባርና ፀረሙስና ዳይሬክቶሬት",
    "Daayirektoreetii Naamusaa fi Farra Malaammaltummaa",
    "Ethics and Anti-Corruption Directorate",
    "temesgen_hundera.jpg",
    "B-01 305"
  ),
  new Employeez(
    23,
    "ተናኜ ነገሰ",
    "Tenagne Negese",
    "Tenagne Negese",
    "የህንፃ አስተዳደር ጽ/ቤት ኃላፊ",
    "Hogganaa Waajjira Bulchiinsa Gamoo",
    "Building Management Office Manager",
    "tenagne_negese.jpg",
    "B-01 103"
  ),
  new Employeez(
    24,
    "ተዋበች ገብሬ",
    "Tewabech Gebre",
    "Tewabech Gebre",
    "የፋሲሊቲ አገልግሎት ቡድን",
    "Garee Tajaajila Faasilitii",
    "Facility Service Team",
    "tewabech_gebre.jpg",
    "B-01 002"
  ),
  new Employeez(
    25,
    "አሰግደዉ ኃ/ጊዮርጊስ",
    "Assegidew H/Giyorgis",
    "Asegdew H/Giyorgis",
    "ምክትል ስራ አስኪያጅ / የስርዓተ ምህዳርና የማዕድን አስተዳደር",
    "Itti Aanaa Hogganaa / Bulchiinsa Sirna Ikoo fi Albuudaa",
    "Deputy Manager / Ecosystem and Mining Management",
    "assegidew_h_giyorgis.jpg",
    "B-01 206"
  ),
  new Employeez(
    26,
    "ሙሉቀን ዮናስ",
    "Muluken Yonas",
    "Muluken Yonas",
    "ምክትል ስራ አስኪያጅ / አካባቢ ብክለትና የአየር ንብረት ለውጥ ዘርፍ",
    "Itti Aanaa Hogganaa / Kutaa Eegumsa Naannoo fi Jijjiirama Qilleensaa",
    "Deputy Manager / Environmental Protection and Climate Change Section",
    "muluken_yonas.jpg",
    "B-01 303"
  ),
  new Employeez(
    27,
    "አማኑኤር ሽብሩ",
    "Amanuel Shibru",
    "Amanuel Shibru",
    "የደን ሀብት አጠቃቀም ቡድን መሪ",
    "Hogganaa Garee Itti Fayyadama Qabeenya Bosonaa",
    "Forest Resource Utilization Team Leader",
    "amanuel_shibru.jpg",
    "B-01 1  06"
  ),
  new Employeez(
    28,
    "ሰናይት ተስፋዬ",
    "Senayit Tesfaye",
    "Senayit Tesfaye",
    "የብክለት ቁጥጥርና የአካባቢ ተፅዕኖ ግምገማ ቡድን",
    "Garee To'annoo Eegumsa Naannoo fi Madaallii Dhiibbaa",
    "Environmental Protection and Impact Assessment Control Team",
    "senayit_tesfaye.jpg",
    "B-01 304"
  ),
  new Employeez(
    29,
    "ብርክቲ መለሰ",
    "Birkti Melesse",
    "Birkti Melesse",
    "አየር ንብረት ለውጥና �ቅድ ዝግጅት ትግበራ ቡድን",
    "Garee Raawwii Jijjiirama Qilleensaa fi Karoora",
    "Climate Change and Planning Implementation Team",
    "birkti_melesse.jpg",
    "B-01 203"
  ),
  new Employeez(
    30,
    "ቴዎድሮስ ሽመልሽ",
    "Tewodros Shimelesh",
    "Tewodros Shimelesh",
    "የነዳጅና የነዳጅ ውጤቶች ተቋማት ቡቃት ማረጋገጫ ቡድን",
    "Garee Mirkaneessa Qulqullina Oomisha Boba'aa fi Boba'aa",
    "Petroleum and Petroleum Products Quality Assurance Team",
    "",
    "B-01 006"
  ),
  new Employeez(
    31,
    "የዉብዳር መለሰ",
    "Yewibdar Melesse",
    "Yewibdar Melesse",
    "የግዥ ቡድን",
    "Garee Bittaa",
    "Procurement Team",
    "",
    "B-01 103"
  ),
  new Employeez(
    32,
    "አለም ሰይድ",
    "Alem Seyid",
    "Alem Seyid",
    "የኢንፎርሜሽን ቴክኖሎጂ ዳይሬክቶሬት",
    "Daayirektoreetii Teeknooloojii Odeeffannoo",
    "Information Technology Directorate",
    "",
    "B-01 013"
  ),
  new Employeez(
    33,
    "አንበሳዉ ፈንታ",
    "Anbesaw Fenta",
    "Anbesaw Fenta",
    "የለውጥና መልካም አስተዳደር ዳይሬክቶሬት",
    "Daayirektoreetii Jijjiiramaa fi Bulchiinsa Gaarii",
    "Change and Good Governance Directorate",
    "",
    "B-02 108"
  ),
  new Employeez(
    34,
    "ዳዊት አባተ",
    "Dawit Abate",
    "Dawit Abate",
    "የህግ �ገልግሎት ቡድን",
    "Garee Tajaajila Seeraa",
    "Legal Service Team",
    "",
    "B-02 104"
  ),
];

const AllEmployees = [...TopEmployees];
