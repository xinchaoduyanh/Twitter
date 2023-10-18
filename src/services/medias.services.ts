import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/files'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { isDevelopment, isProduction } from '~/utils/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  enqueue(item: string) {
    this.items.push(item)
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromises.unlink(videoPath)
        console.log(`Encode video ${videoPath} thành công`)
      } catch (err) {
        console.log(`Encode video ${videoPath} thất bại`)
        console.log(err)
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
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/uploads/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    // console.log('file', files)
    console.log(files)
    const result: Media[] = files.map((file) => {
      const { newFilename } = file
      return {
        url: isProduction
          ? `${process.env.HOST}/uploads/${newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${newFilename}`,
        type: MediaType.Video
      }
    })
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
}

const mediasService = new MediasService()
export default mediasService
