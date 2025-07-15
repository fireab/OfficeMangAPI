import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class Position extends Model {
  public id!: number;
  public name_en!: string;
  public name_am!: string;
  public name_or?: string;
  public parent_id?: number;
  public has_sub: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Position.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_am: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_or: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      has_sub: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "position",
      tableName: "positions",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
