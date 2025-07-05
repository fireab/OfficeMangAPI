import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class Comment extends Model {
    public id!: number;
    public feedback: string;
    public name:string;
    public email:string;
    public phone:string;
    public year:number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
    Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        feedback: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },       
        year:{
            type: DataTypes.INTEGER,
        }, 
        name:{
            type:DataTypes.STRING
        },
        phone:{
            type:DataTypes.STRING
        }
    },
    {
      sequelize,
      modelName: "comment",
      tableName: "comments",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
