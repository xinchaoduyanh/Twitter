import express, { Request, Response, NextFunction, ErrorRequestHandler, RequestHandler } from 'express'
export const wrapRequestHandler = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next)
  }
}
