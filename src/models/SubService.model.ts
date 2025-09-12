import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class SubService extends Model {
  id: number;
  title: string;
  titleEn: string;
  service_id: number;
}

export default (sequelize: Sequelize) => {
  SubService.init(
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
    },
    {
      sequelize,
      modelName: "subService",
      tableName: "subServices",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
