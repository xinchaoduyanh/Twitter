import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { handleUploadSingleImage } from '~/utils/files'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await handleUploadSingleImage(req, res, next)
  return res.json({
    res: data
  })
}
