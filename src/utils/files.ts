import fs from 'fs'
import path from 'path'
export const initFolerUpload = () => {
  const pathUpload = path.resolve('uploads')
  if (!fs.existsSync(pathUpload)) {
    fs.mkdirSync(pathUpload, {
      recursive: true // tạo thư mục cha nếu cha chưa tồn tại
    })
  }
}