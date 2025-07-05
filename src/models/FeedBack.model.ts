import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class FeedBack extends Model {
    public id!: number;
    public type:string; 
    public content: string;
    public name: string;
    public email:string;
    public phone:string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
// 
export default (sequelize: Sequelize) => {
  FeedBack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        type:{
            type: DataTypes.STRING
        }, 
        content: {
            type: DataTypes.STRING
        },
        name: {
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        phone:{
            type:DataTypes.STRING
        },
       
    },
    {
      sequelize,
      modelName: "feedback",
      tableName: "feedbacks",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
