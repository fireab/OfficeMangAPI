
import { Request,Response } from "express";
import StatisticsService, { Ratee } from "../services/Statistics.service";
import _ from "lodash";
import { Employee } from "../models/Employee.model";
import { Rate } from "../models/Rate.model";
import { Compliment } from "../models/Compilment.model";
import { Op } from "sequelize";
import RateService from ".././services/Rate.service";
import XLSX from 'xlsx';
var ethiopianDate = require('ethiopian-date');
import { EthiopianMonths } from "../helpers/constants/Month.constant";
function ServiceAverage(rate:Ratee|null):number {
    let total=0;
    let divedee=0;
    if (rate) {
        if(rate.Excellent){
            total=total+(rate.Excellent*4);
            divedee=divedee+rate.Excellent
        }
        if(rate.VeryGood){
            total=total+rate.VeryGood*3;
            divedee=divedee+rate.VeryGood
        }
        if(rate.Intermediate){
            total=total+(rate.Intermediate*2);
            divedee=divedee+rate.Intermediate
        }
        if(rate.Good){
            total=total+rate.Good*1;
            divedee=divedee+rate.Good
        }
        if(rate.Bad){
            total=total-rate.Bad*1;
            divedee=divedee+rate.Bad
        }

        return (total)/divedee
    }else{
        return total;
    }

}
function TotalAverage(averages:number[]):number {
    let total:number=0;
    averages.map(average=>{
        total=total+average;
    })
    return total/averages.length;
}
export class StatisticsController{
    static findInGroup(
        request:Request,
        response:Response,
        next:Function
    ){
        let year=request.body.year?request.body.year:null;
        StatisticsService.findAllRateInNumber(year)
        .then((result:any)=>{
            response.send(result);
        })
        .catch((error:any)=>{
            next(error)
        })
    }
    static findFeedBackForEmployee(
        request:Request,
        response:Response,
        next:Function
    ){
        let year=request.body.year?request.body.year:null;
        let EmployeeId=_.toNumber (request.params.id);
        let query:any={};
        if (EmployeeId) {
            query={...query,EmployeeId:EmployeeId};
        }
        let dateFilter=request.query.dateFilter as string|| 'all';
        if (dateFilter === '7') {
              query={...query,created_date:{
                [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}};
            
        } else if (dateFilter === '30') {
            query={...query,created_date:{
            [Op.gte]: new Date(Date.now() - 30* 24 * 60 * 60 * 1000)}};
        } else if (dateFilter === '60') {
            query={...query,created_date:{
            [Op.gte]: new Date(Date.now() - 60* 24 * 60 * 60 * 1000)}};
        } else if (dateFilter === '90') {
            query={...query,created_date:{
            [Op.gte]: new Date(Date.now() - 90* 24 * 60 * 60 * 1000)}};
        }
        StatisticsService.findAllRateInNumberForEmployee(query,year)
        .then(async (result:any)=>{
            let rates:Rate[]=await Rate.findAll({
                where:query,
                order:[],
                include:[]
              })
            response.send({result,"total":rates.length});
        })
        .catch((error:any)=>{
            next(error)
        })
    }
    static async total(
        request:Request,
        response:Response,
        next:Function
    ){
        try {
            let year=request.body.year?request.body.year:new Date().getFullYear();
            let totalEmployee:number=await Employee.count();
            let totalFeedback:number =await Rate.count({where:{year:year}});
            let complaint :number =await Compliment.count({where:{year:year}})
            let totalRespondedComplain :number =await Compliment.count({where:{year:year,responded:true}})
            console.log("Year",year)
            response.json({
                totalEmployee:totalEmployee,
                totalFeedback:totalFeedback,
                complaint:complaint,
                totalRespondedComplain:totalRespondedComplain
            })
        } catch (error) {
            next(error)
        }

    }
    static async totalRateAverageInYear(
        request:Request,
        response:Response,
        next:Function
    ){
        try {
            let year:number=request.body.year?request.body.year:new Date().getFullYear();
            let year1:number=year-4;
            let year2:number=year-3;
            let year3:number=year-2;
            let year4:number=year-1;
            let av:number=0;
            let av1:number=0;
            let av2:number=0;
            let av3:number=0;
            let av4:number=0;
            let averages:number[]=[];
            let data = await StatisticsService.findAllRateInNumber(year)
            console.log("data ",data)
            let data1 = await StatisticsService.findAllRateInNumber(year1)
            console.log("data ",data1)
            let data2 = await StatisticsService.findAllRateInNumber(year2)
            console.log("data ",data2)
            let data3 = await StatisticsService.findAllRateInNumber(year3)
            console.log("data ",data3)
            let data4 = await StatisticsService.findAllRateInNumber(year4)
            console.log("data ",data4)

            let datas=[data1,data2,data3,data4,data]
            let years=[year1,year2,year3,year4,year]

            for (let index = 0; index < datas.length; index++) {
                let cav1=ServiceAverage(datas[index].CustomerService);
                let fav1=ServiceAverage(datas[index].FairService);
                let rav1=ServiceAverage(datas[index].ResponseForCompliment);
                let sav1=ServiceAverage(datas[index].ServiceRate);
                let stav1=ServiceAverage(datas[index].StandardService);

                let totalav1=TotalAverage([cav1,fav1,rav1,sav1,stav1])
                averages.push(totalav1);
            }
            response.json(
                {
                    averages,
                    years
                }
            )
        } catch (error) {
            next(error)
        }

    }
    static async customerRateTheBranch(
        request:Request,
        response:Response,
        next:Function
    ){
        try {
        let year:number=request.body.number?request.body.year:new Date().getFullYear();
        let data=await StatisticsService.customerRateTheBranch(year)
        response.send(data)
    } catch (error) {
        next(error);
    }
    }
    static async employeeTotalRates(
        request:Request,
        response:Response,
        next:Function
    ){
        try {
        let year:number=request.body.number?request.body.year:new Date().getFullYear();
        let data=await StatisticsService.employeeAverage(year)
        console.log("Sendeing");
        response.send(data)
    } catch (error) {
        next(error);
    }
    }
    static async findTopRatedEmployees(
        request:Request,
        response:Response,
        next:Function){
            try {
                let year:number=request.body.number?request.body.year:new Date().getFullYear();
                let dateFilter:string|null=request.query.dateFilter as string|null;
                let query={};
                if (dateFilter === '7') {
                    query={...query,created_date:{
                      [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}};
                  
                  } else if (dateFilter === '30') {
                    query={...query,created_date:{
                      [Op.gte]: new Date(Date.now() - 30* 24 * 60 * 60 * 1000)}};
                  } else if (dateFilter === '60') {
                    query={...query,created_date:{
                      [Op.gte]: new Date(Date.now() - 60* 24 * 60 * 60 * 1000)}};
                  } else if (dateFilter === '90') {
                    query={...query,created_date:{
                      [Op.gte]: new Date(Date.now() - 90* 24 * 60 * 60 * 1000)}};
                  }
                query={...query,year:year};
                let data=await StatisticsService.findTopRatedEmployees(query)
                response.send(data)
            } catch (error) {
                next(error);
            }
        }
    static async exportEmployeeRanks(
        request:Request,response:Response,next:Function
    ){
        let dateFilter:string|null=request.query.dateFilter as string|null;
        let query={};
        let year:number=request.body.number?request.body.year:new Date().getFullYear();
        if (dateFilter === '7') {
            query={...query,created_date:{
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}};
          
        } else if (dateFilter === '30') {
        query={...query,created_date:{
            [Op.gte]: new Date(Date.now() - 30* 24 * 60 * 60 * 1000)}};
        } else if (dateFilter === '60') {
        query={...query,created_date:{
            [Op.gte]: new Date(Date.now() - 60* 24 * 60 * 60 * 1000)}};
        } else if (dateFilter === '90') {
        query={...query,created_date:{
            [Op.gte]: new Date(Date.now() - 90* 24 * 60 * 60 * 1000)}};
        }
        query={...query,year:year};
        let data=await StatisticsService.findTopRatedEmployees(query)
        let validateNumericAndReturnPercentile=(averageScore:string):number=>{
            try {
                let ave=Number(averageScore);
                let total=(ave*100)/4;
                return total;
            } catch (error) {
                return 0;
            }
            
        }
        console.log("Rates ",data[0].dataValues)
        const jsonData = data.map((rate:any) => ({
                    "ሰራተኛ ስም ": rate.employee.amharic_name,
                    "የስራ ድርሻ": rate.employee.position,
                    "ነጥብ":rate.dataValues.averageScore,
                    "ነጥብ በ %": validateNumericAndReturnPercentile(rate.dataValues.averageScore)
                    
                  }));
        console.log("JSON DATA ",jsonData)
        // Generate a worksheet
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rate');
        // Write the workbook to a buffer
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        // Set headers for downloading the file
        response.setHeader('Content-Disposition', 'attachment; filename="rates.xlsx"');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // Send the buffer as a response
        response.send(excelBuffer);
    }
    static async findTopRatedEmployeesInMonth(
        request:Request,response:Response,next:Function){
            const date=new Date();
            const e_Date=ethiopianDate.toEthiopian(date.getFullYear(),date.getMonth()+1,date.getDate());
            console.log("Ethiopian Date",e_Date);
            const current_ethioipian_month=e_Date[1];
            const current_ethioipian_day=e_Date[2];
            const current_ethioipian_year=e_Date[0];
            const last_month=current_ethioipian_month==0?0:current_ethioipian_month-1;
            const start_date=ethiopianDate.toGregorian(current_ethioipian_year,last_month,1);
            const end_date=ethiopianDate.toGregorian(current_ethioipian_year,last_month,30);
            const valid_start_date=new Date(start_date[0],last_month,start_date[2]);
            const valid_end_date=new Date(end_date[0],end_date[1]-1,end_date[2]);
            console.log("Start Date",start_date);
            console.log("End Date",end_date);
            console.log("Valid Start Date",valid_start_date);
            console.log("Valid End Date",valid_end_date);
            let query={};
            query={...query,created_date:{
                [Op.between]: [valid_start_date,valid_end_date]
            }};
            let data=await StatisticsService.findTopRatedEmployees(query)
                response.send({data,month:EthiopianMonths[last_month-1]})
            
        }
}