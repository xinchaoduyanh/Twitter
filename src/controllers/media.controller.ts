import { NextFunction, Request, Response } from 'express'
import path from 'path'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'), // thư mục chứa file trên server
    maxFiles: 1,
    keepExtensions: true, //
    maxFileSize: 300 * 1024 // 300KB
  })
  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err
    }
    res.json({
      message: 'upload image success1'
    })
  })
}
