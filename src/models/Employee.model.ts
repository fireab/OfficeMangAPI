import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class Employee extends Model {
  public id!: number;
  public team_id!: number;
  public amharic_name!: string;
  public oromic_name!: string;
  public english_name!: string;
  public oromic_position!: string;
  public path!: string;
  public position!: string;
  public english_position!: string;
  public office!: string;
  public is_director!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Employee.init(
    {
      id:{
        type:DataTypes.INTEGER,
        autoIncrement:false,
        primaryKey:true
      },
      team_id:{
        type:DataTypes.INTEGER,
      },
      amharic_name:{
        type:DataTypes.STRING,
      },
      oromic_name:{
        type:DataTypes.STRING,
      },
      english_name:{
        type:DataTypes.STRING,
      },
      oromic_position:{
        type:DataTypes.STRING,
      },
      path:{
        type:DataTypes.STRING,
      },
      position:{
        type:DataTypes.STRING,
      },
      english_position:{
        type:DataTypes.STRING,
      },
      office:{
        type:DataTypes.STRING,
      },
      is_director:{
        type:DataTypes.BOOLEAN
      }
    },
    {
      sequelize,
      modelName: "employee",
      tableName: "employees",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
