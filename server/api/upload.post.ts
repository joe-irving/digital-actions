import fs from 'fs'
import path from 'path'
import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  const { files } = await readFiles(event)

  const imageName = String(Date.now()) + String(Math.round(Math.random() * 10000000))
  const fileName = `${imageName}.${files.file[0].mimetype.split('/')[1]}`
  const newPath = `${path.join('public', 'uploads', fileName)}`
  const publicPath = `/uploads/${fileName}`
  fs.copyFileSync(files.file[0].filepath, newPath)

  return { success: true, path: publicPath, name: fileName }
})
