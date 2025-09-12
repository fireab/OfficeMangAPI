import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
import { SubService } from "./SubService.model";
export class Service extends Model {
  id: number;
  title: string;
  titleEn: string;
  icon: string;
  color: string;
  subServices: SubService[];
}

export default (sequelize: Sequelize) => {
  Service.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      titleEn: {
        type: DataTypes.STRING,
      },
      icon: {
        type: DataTypes.STRING,
      },
      color: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "service",
      tableName: "services",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
