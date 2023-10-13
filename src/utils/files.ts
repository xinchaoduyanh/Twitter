import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
export const initFolerUpload = () => {
  const pathUpload = path.resolve('uploads')
  if (!fs.existsSync(pathUpload)) {
    fs.mkdirSync(pathUpload, {
      recursive: true // tạo thư mục cha nếu cha chưa tồn tại
    })
  }
}
export const handleUploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'), // thư mục chứa file trên server
    maxFiles: 1,
    keepExtensions: true, //
    maxFileSize: 300 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = 'images' === name && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    } // 300KB
  })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log('files', files)
      console.log('fields', fields)
      console.log('err', err)

      if (err) {
        return reject(err)
      }
      if (!files.images) {
        return reject(new Error('File is not valid'))
      }
      resolve(files)
    })
  })
}
