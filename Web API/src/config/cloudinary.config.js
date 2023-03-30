require('dotenv').config()

module.exports = {
    api_secret: process.env.api_secret,
    api_key: process.env.api_key,
    cloud_name: process.env.cloud_name,
    autoTagging_type: process.env.autoTagging_type
}