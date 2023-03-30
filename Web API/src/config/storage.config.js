
require('dotenv').config()

module.exports = {
    storage: process.env.storage,
    videoUrl: process.env.videoUrl,
    thumbnailUrl: process.env.thumbnailUrl,
    ffmpeg: process.env.ffmpeg,
    tempPath: process.env.temp_path
}