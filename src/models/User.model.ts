import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public firstname:string;
  public lastname:string;
  public email:string;
  public isSuperAdmin:boolean;
  public created_by: string;
  public updated_by: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      firstname:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      email:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isSuperAdmin:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "user",
      tableName: "users",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
