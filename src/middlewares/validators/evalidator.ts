import evalidate from "evalidate";
import Schema from "evalidate/dist/types/schema";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../errors/Errors";

function validationByEvalidator(schemaObject: Object) {
  return async (request: Request, response: Response, next: NextFunction) => {
    let schema: Schema = new evalidate.schema(schemaObject);
    let result = await schema.validate(request.body);
    if (result.isValid) {
      next();
    } else {
      let err = new BadRequestError(result.errors);
      next(err);
    }
  };
}
