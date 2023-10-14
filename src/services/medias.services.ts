import { Request } from 'express'
import { getNameFromFullName, handleUploadImage } from '~/utils/files'
import sharp from 'sharp'
import { UPLOAD_DIR, UPLOAD_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
import { isDevelopment, isProduction } from '~/utils/config'
import { MediaType } from '~/constants/enums'
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    // console.log('file', file)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = UPLOAD_DIR + '/' + newName + '.jpg'
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
}

const mediasService = new MediasService()
export default mediasService
