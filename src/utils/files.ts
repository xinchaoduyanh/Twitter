import { get } from 'axios'
import { NextFunction, Request, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolerUpload = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // tạo thư mục cha nếu cha chưa tồn tại
      })
    }
  })
}
export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR, // thư mục chứa file trên server
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
export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR, // thư mục chứa file trên server
    maxFiles: 1,
    // keepExtensions: true, //
    maxFileSize: 500 * 1024 * 1024, // 50MB
    maxTotalFileSize: 500 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      // const valid = 'video' === name && Boolean(mimetype?.includes('video') || mimetype?.includes('quicktime '))
      // if (!valid) {
      //   form.emit('error' as any, new Error('File type is not valid') as any)
      // }
      // return valid
      return true
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log('files', files)
      console.log('fields', fields)
      console.log('err', err)
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is not valid'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const oldPath = video.filepath
        const newPath = path.join(oldPath + '.' + getExtensionFromFullName(video.originalFilename as string))
        fs.renameSync(oldPath, newPath)
        video.filepath = newPath
        video.newFilename = video.newFilename + '.' + getExtensionFromFullName(video.originalFilename as string)
      })
      // console.log('ok', (files.images as File[])[0])
      resolve(files.video as File[])
      // resolve(files)
    })
  })
}
export const getNameFromFullName = (filename: string) => {
  const name = filename.split('.')
  name.pop()
  return name.join('')
}
export const getExtensionFromFullName = (filename: string) => {
  const name = filename.split('.')
  return name.pop()
}
