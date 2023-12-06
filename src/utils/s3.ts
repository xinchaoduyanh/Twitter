import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import { Response } from 'express'
import fs from 'fs'
import path from 'path'
import { envConfig } from '~/constants/config'
import { HTTP_STATUS } from '~/constants/httpStatus'
const s3 = new S3({
  region: envConfig.awsRegion as string,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey as string,
    accessKeyId: envConfig.awsAccessKeyId as string
  }
})

export const uploadFileToS3 = async ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: envConfig.awsBucketName as string,
      Key: fileName,
      Body: fs.readFileSync(filePath),
      ContentType: contentType
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 10, // optional size of each part, in bytes, at least 10MB
    leavePartsOnError: false // optional manually handle dropped parts
  })
  return parallelUploads3.done()
}
export const sendFileFromS3 = async (res: Response, filepath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: envConfig.awsBucketName as string,
      Key: filepath
    })
    ;(data.Body as any).pipe(res)
  } catch (err) {
    res.status(HTTP_STATUS.NOT_FOUND).send('Not Found')
  }
}
// const file = fs.readFileSync(path.resolve('uploads/images/123.jpg'))
// const parallelUploads3 = new Upload({
//   client: s3,
//   params: { Bucket: 'twitter-ap-southeast-1-by-duyanh', Key: 'anh2.jpg', Body: file, ContentType: 'image/jpeg' },

//   tags: [
//     /*...*/
//   ], // optional tags
//   queueSize: 4, // optional concurrency configuration
//   partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
//   leavePartsOnError: false // optional manually handle dropped parts
// })

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })

// parallelUploads3.done().then((res) => {
//   console.log(res)
// })
