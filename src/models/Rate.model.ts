import { v4 as uuidv4 } from "uuid";
import { Sequelize, Model, DataTypes } from "sequelize";
import { Employee } from "./Employee.model";
export class Rate extends Model {
    public id!: number;
    public CustomerService:string; 
    public StandardService: string;
    public FairService: string;
    public ResponseForCompliment:string;
    public ServiceRate:string;
    public EmployeeId: number;
    public year:number;
    public name:string;
    public phone:string;
    public employee: Employee;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
    Rate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        CustomerService:{
            type: DataTypes.STRING,
        }, 
        StandardService: {
            type: DataTypes.STRING,
        }, 
        FairService: {
            type: DataTypes.STRING,
        }, 
        ResponseForCompliment:{
            type: DataTypes.STRING,
        }, 
        ServiceRate:{
            type: DataTypes.STRING,
        }, 
        EmployeeId: {
            type: DataTypes.INTEGER,
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
      modelName: "rate",
      tableName: "rates",
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
};
