import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    res: url,
    message: USERS_MESSAGES.UPLOAD_SUCCESS
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    res: url,
    message: USERS_MESSAGES.UPLOAD_SUCCESS
  })
}
export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideoHLS(req)
  return res.json({
    res: url,
    message: USERS_MESSAGES.UPLOAD_SUCCESS
  })
}
export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found')
    }
  })
}
export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  //! MB = 10 ^ 6 bytes (Thu ma chung ta hay thay tren cac trang web)

  //Dung luong video
  const videoSize = fs.statSync(videoPath).size
  //Dung luong video cho moi phan doan stream
  const CHUNK_SIZE = 10 ** 6 // 1MB
  //Lay gia tri byte bat dau tu header range
  const start = Number(range.replace(/\D/g, ''))
  // Lay gia tri byte ket thuc tu header range
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  //Dung luong thuc te cua phan doan stream
  //Thuong day la Chunk size nhung neu la phan cuoi cung thi se nho hon chunk size
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
export const serveM3U8Controller = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  // const realId = id.replace('.m3u8', '')
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found')
    }
  })
}
export const serveSegMentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id, v, segment } = req.params
  console.log(segment)

  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found')
    }
  })
}
export const VideoStatusController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const videoStatus = await mediasService.getVideoStatus(id)
  return res.json({
    result: videoStatus,
    message: USERS_MESSAGES.GET_VIDEO_STATUS_SUCCESS
  })
}
