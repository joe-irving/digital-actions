// import fs from 'fs'
// import path from 'path'
import { readFiles } from 'h3-formidable'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: 'google-key.json'
})
const bucket = storage.bucket(process.env.GOOGLE_BUCKET_ID || '')

export default defineEventHandler(async (event) => {
  const { files } = await readFiles(event)

  const imageName = String(Date.now()) + String(Math.round(Math.random() * 10000000))
  const fileName = `${imageName}.${files.file[0].mimetype.split('/')[1]}`
  const uploadedFile = await bucket.upload(files.file[0].filepath, {
    destination: fileName,
    public: true
  })

  return { success: true, path: uploadedFile[0].metadata.mediaLink, name: fileName }
})
