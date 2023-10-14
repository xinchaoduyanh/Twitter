import { NextFunction, Request, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolerUpload = () => {
  const pathUpload = UPLOAD_TEMP_DIR
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // tạo thư mục cha nếu cha chưa tồn tại
    })
  }
}
export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR, // thư mục chứa file trên server
    maxFiles: 4,
    keepExtensions: true, //
    maxFileSize: 300 * 1024, // 300KB
    maxTotalFileSize: 300 * 4 * 1024, // 1200KB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = 'images' === name && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      // console.log('files', files)
      // console.log('fields', fields)
      // console.log('err', err)

      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.images)) {
        return reject(new Error('File is not valid'))
      }
      // console.log('ok', (files.images as File[])[0])
      resolve(files.images as File[])
      // resolve(files)
    })
  })
}

export const getNameFromFullName = (filename: string) => {
  const name = filename.split('.')
  name.pop()
  return name.join('')
}
