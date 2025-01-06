import { NextFunction, Request,Response } from "express"

export const catchError = (fn: (req: Request, res: Response, next: NextFunction) =>
    Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
  fn(req,res,next).catch((err)=>{
    // res.json(err)
next(err)
  })
}
}