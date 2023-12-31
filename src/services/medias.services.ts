import { Request } from 'express'
import { getFiles, getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/files'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { envConfig, isDevelopment, isProduction } from '~/constants/config'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { log } from 'console'
import { ObjectId } from 'mongodb'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3/dist-types/commands'
import path from 'path'
class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    console.log(item)
    const idName1 = getNameFromFullName(item.split('/').pop() as string)
    const idName2 = idName1.split('\\')
    const idName = idName2[idName2.length - 1]
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName1 = getNameFromFullName(videoPath.split('/').pop() as string)
      const idName2 = idName1.split('\\')
      const idName = idName2[idName2.length - 1]
      await databaseService.videoStatus.updateOne(
        {
          name: idName
        },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
      this.processEncode()
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        const files = getFiles(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await Promise.all(
          files.map((file) => {
            let fileName = 'video-hls' + file.replace(path.resolve(UPLOAD_VIDEO_DIR), '')
            fileName = fileName.replace(/\\/g, '/')
            return uploadFileToS3({
              fileName,
              filePath: file,
              contentType: mime.getType(path.resolve(UPLOAD_VIDEO_DIR, idName, file)) || 'video/*'
            })
          })
        )

        // await Promise.all([fsPromises.unlink(videoPath), fsPromises.unlink(path.resolve(UPLOAD_VIDEO_DIR, idName))])
        await databaseService.videoStatus.updateOne(
          {
            name: idName
          },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updatedAt: true
            }
          }
        )
        console.log(`Encode video ${videoPath} thành công`)
      } catch (err) {
        const idName1 = getNameFromFullName(videoPath.split('/').pop() as string)
        const idName2 = idName1.split('\\')
        const idName = idName2[idName2.length - 1]
        await databaseService.videoStatus
          .updateOne(
            {
              name: idName
            },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updatedAt: true
              }
            }
          )
          .catch((err) => {
            console.log(err)
          })
        log(`Encode video ${videoPath} thất bại`)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('Hết video để encode')
    }
  }
}
const queue = new Queue()
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    // console.log('file', file)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = UPLOAD_IMAGE_DIR + '/' + newName + '.jpg'
        await sharp(file.filepath).jpeg({ quality: 50 }).toFile(newPath)
        const s3Result = await uploadFileToS3({
          fileName: 'images/' + newName + '.jpg',
          filePath: newPath,
          contentType: mime.getType(newPath) || 'image/*'
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          fileName: 'videos/' + file.newFilename,
          filePath: file.filepath,
          contentType: mime.getType(file.filepath) || 'video/*'
        })
        fsPromises.unlink(file.filepath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({
      name: id
    })
    return data
  }
}

const mediasService = new MediasService()
export default mediasService
