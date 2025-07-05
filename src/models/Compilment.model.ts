import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
export class Compliment extends Model {
    public id!: number;
    public fullName: string;
    public city:string;
    public subCity: string;
    public woreda:string;
    public homeNo:string;
    public phoneNumber:string;
    public reason:string;
    public complimentDate: string;
    public placeSubCity:string;
    public placeWoreda:string;
    public employerName:string;
    public expectedResponse: string;
    public responded:boolean;
    public year:number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
    Compliment.init(
    {
      id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      fullName:{
        type:DataTypes.STRING,
      },
      city:{
        type:DataTypes.STRING,
      },
      subCity:{
        type:DataTypes.STRING,
      },
      woreda:{
        type:DataTypes.STRING,
      },
      homeNo:{
        type:DataTypes.STRING,
      },
      phoneNumber:{
        type:DataTypes.STRING,
      },
      reason:{
        type:DataTypes.STRING,
      },
      complimentDate: {
        type:DataTypes.STRING,
      },
      placeSubCity:{
        type:DataTypes.STRING,
      },
      placeWoreda:{
        type:DataTypes.STRING,
      },
      employerName:{
        type:DataTypes.STRING,
      },
      expectedResponse: {
        type:DataTypes.STRING,
      },
      responded:{
        type:DataTypes.BOOLEAN,
      },
      year:{
        type:DataTypes.INTEGER
      },
    },
    {
      sequelize,
      modelName: "compilment",
      tableName: "compilments",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
