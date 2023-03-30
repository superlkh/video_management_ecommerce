require('dotenv').config()

module.exports = {
    FRAME_STEP: process.env.FRAME_STEP,
    AUTO_TAGGING_CONFIDENT: process.env.AUTO_TAGGING_CONFIDENT,
    PAGE_SIZE_IMAGE: process.env.PAGE_SIZE_IMAGE
}