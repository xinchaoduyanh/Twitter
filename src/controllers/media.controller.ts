import { NextFunction, Request, Response } from 'express'
import path from 'path'
import mediasService from '~/services/medias.services'
import { handleUploadSingleImage } from '~/utils/files'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await mediasService.handleUploadSingleImage(req)
  return res.json({
    res: data
  })
}
