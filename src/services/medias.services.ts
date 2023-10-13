import { Request } from 'express'
import { getNameFromFullName, handleUploadSingleImage } from '~/utils/files'
import sharp from 'sharp'
import { UPLOAD_DIR, UPLOAD_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    console.log('file', file)
    const newName = getNameFromFullName(file.newFilename)
    const newPath = UPLOAD_DIR + '/' + newName + '.jpg'
    console.log('newpath', newPath)

    await sharp(file.filepath).jpeg({ quality: 50 }).toFile(newPath)
    fs.unlinkSync(file.filepath)
    return `http://localhost:4000/uploads/${newName}.jpg`
  }
}

const mediasService = new MediasService()
export default mediasService
