import express, { Request, Response, NextFunction, ErrorRequestHandler, RequestHandler } from 'express'
export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next)
  }
}
