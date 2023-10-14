import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/files'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
import { isDevelopment, isProduction } from '~/utils/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
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
    // console.log('file', file)
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
}

const mediasService = new MediasService()
export default mediasService
