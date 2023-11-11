import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/files'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { isDevelopment, isProduction } from '~/utils/config'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { log } from 'console'
import { ObjectId } from 'mongodb'
import { uploadImageToS3 } from '~/utils/s3'
import mime from 'mime'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3/dist-types/commands'
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
        await fsPromises.unlink(videoPath)
        const idName1 = getNameFromFullName(videoPath.split('/').pop() as string)
        const idName2 = idName1.split('\\')
        const idName = idName2[idName2.length - 1]
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
        const s3Result = await uploadImageToS3({
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
        const s3Result = await uploadImageToS3({
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
    // console.log(files)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)

        // await encodeHLSWithMultipleVideoStreams(file.filepath)
        // await fsPromises.unlink(file.filepath)
        queue.enqueue(file.filepath)
        // await fsPromises.unlink(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}/master.m3u8`,
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
