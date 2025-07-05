import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ConflictError } from "../../errors/Errors";
export  const validate =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
      //   schema.parse({
      //     body: req.body,
      //     query: req.query,
      //     params: req.params,
      //   });

      next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message:e.path[0] + e.message }));
      }
      return res.status(409).json({
        status: "failed",
        error: err,
      });
    }
  };