import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
import { Position } from "./position.mode";
export class Ad extends Model {
  public id!: number;
  public type: string;
  public src: string;
  public title: string;
  public description: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Ad.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
      },
      src: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ad",
      tableName: "ads",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
