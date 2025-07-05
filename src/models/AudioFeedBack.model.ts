import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class AudioFeedBack extends Model {
    public id!: number;
    public file_name:string; 
    public file_path: string;
    public name!:string;
    public phone!:string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
// 
export default (sequelize: Sequelize) => {
  AudioFeedBack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        file_name:{
            type: DataTypes.STRING
        }, 
        file_path: {
            type: DataTypes.STRING
        },
        name:{
          type:DataTypes.STRING,
        },
        phone:{
          type:DataTypes.STRING
        }        
    },
    {
      sequelize,
      modelName: "audio_feedback",
      tableName: "audio_feedbacks",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
