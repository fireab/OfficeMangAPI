import { Op } from "sequelize";
import _ from "lodash";
import async from "async";
import config from "config";
import { Request,Response } from "express";
import {
  Error,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/Errors";
import { Compliment } from "../helpers/database/Sequelize";
import { Transaction } from "sequelize/types";
import ComplimentService from "../services/Compilment.service";
import { request } from "http";
import XLSX from 'xlsx';

class ComplimentController {
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findMany(
    request: Request,
    response: Response,
    next: Function,
  ) {
    let query={};
    let page:number = _.toNumber(request.query.page) || 1;
    let limit:number = _.toNumber(request.query.limit) || 10;
    let dateFilter=request.query.dateFilter as string|| 'all';
    let stateFilter=request.query.responded || 'all';
    let targetEmployee=request.query.targetEmployee || null;
    let search=request.query.search || null; 
    if (targetEmployee && targetEmployee.toString().toLocaleLowerCase() !== 'all') {
      query={...query,employerName:targetEmployee};
    }   
    // Add date range filter
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
    // Add state filter
    if (stateFilter === 'responded') {
      query={...query,responded:true};
    } else if (stateFilter === 'notResponded') {
      query={...query,responded:false};
    }
    if (search) {
      query={...query,fullName:{[Op.like]:`%${search}%`}}
    }
    ComplimentService.findMany(query, [], [])
        .then((result: Compliment[]) =>{
          console.log("result ",result.length)
          const jsonData = result.map((compliment:Compliment) => ({
            "ID": compliment.id,
            "የቅሬታ አቅራቢው ሙሉ ስም": compliment.fullName,
            "ክ/ከተማ ":compliment.subCity,
            "ከተማ":compliment.city,
            "ክ/ከተማ": compliment.placeSubCity,
            "ወረዳ":compliment.placeWoreda,
            "ስልክ.ቁ":compliment.phoneNumber,
            "ቅሬታ የቀረበበት ዋና ጉዳይ በአጭሩ ይገለጽ":compliment.reason,
            "ባለጉዳዩ እንዲደረግለት የሚፈልገው": compliment.expectedResponse,
            "ቀን": compliment.complimentDate,
            "ጉዳዩ የሚመለከተው የአገልግሎት ሰጪ": compliment.employerName,
            "መልስ አጊንቷል":compliment.responded?'yes':'no',
            "ዓመት":compliment.year
          }));
      
          // Generate a worksheet
          const worksheet = XLSX.utils.json_to_sheet(jsonData);
      
          // Create a new workbook
          const workbook = XLSX.utils.book_new();
      
          // Append the worksheet to the workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Compliments');
      
          // Write the workbook to a buffer
          const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
          // Set headers for downloading the file
          response.setHeader('Content-Disposition', 'attachment; filename="compliments.xlsx"');
          response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
          // Send the buffer as a response
          response.send(excelBuffer);
        })
        .catch((error: any) => next(error));
  }
  /**
   *
   * @param query
   * @param order
   * @param includes
   * @param transaction
   * @returns
   */
  static findById(
    request: Request,
    response: Response,
    next: Function,
  ) {
    ComplimentService.findOne({id:request.params.id}, [], [])
        .then((compliment:Compliment)=>response.send(compliment))
        .catch((error: any) => next(error));
  }
  static findManyPaginate(
    request: Request,
    response: Response,
    next: Function,
  ) {
    let query={};
    let page:number = _.toNumber(request.query.page) || 1;
    let limit:number = _.toNumber(request.query.limit) || 10;
    let dateFilter=request.query.dateFilter as string|| 'all';
    let stateFilter=request.query.responded || 'all';
    let targetEmployee=request.query.targetEmployee || null;
    let search=request.query.search || null; 
    if (targetEmployee && targetEmployee.toString().toLocaleLowerCase() !== 'all') {
      query={...query,employerName:targetEmployee};
    }   
    // Add date range filter
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
    // Add state filter
    if (stateFilter === 'responded') {
      query={...query,responded:true};
    } else if (stateFilter === 'notResponded') {
      query={...query,responded:false};
    }
    if (search) {
      query={...query,fullName:{[Op.like]:`%${search}%`}}
    }
    ComplimentService.findManyPaginate(query,[],page,limit)
        .then((compliment:any)=>response.send(compliment))
        .catch((error: any) => next(error));
  }
  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static create(request: Request,
    response: Response,
    next: Function){
        const currentYear = new Date().getFullYear();
        ComplimentService.create({
          fullName: request.body.fullName,
          city:request.body.city,
          subCity: request.body.subCity,
          woreda:request.body.woreda,
          homeNo:request.body.homeNo,
          phoneNumber:  request.body.phoneNumber,
          reason: request.body.reason,
          complimentDate: request.body.complimentDate,
          placeSubCity:request.body.placeSubCity,
          placeWoreda:request.body.placeWoreda,
          employerName:request.body.employerName,
          expectedResponse: request.body.expectedResponse,
          responded:request.body.responded,
          year:currentYear
        })
          .then((result: Compliment) => response.send(result))
          .catch((error: any) => next(new BadRequestError(error)));
  }
  /**
   *
   * @param body
   * @param transaction
   * @returns
   */
  static update(request: Request,
    response: Response,
    next: Function){
      ComplimentService.update({id:request.params.id}, request.body)
    .then((result: Compliment) => response.send(result))
    .catch((error: any) => next(new InternalServerError(error)));
  }

}

export default ComplimentController;
