const CronJob = require('cron').CronJob;
const cloudinary = require('cloudinary')

const cloudinary_config = require('../config/cloudinary.config')
const db = require('../models/index')
const Attachment = db.attachment
const storage = require('../config/storage.config')


cloudinary.config({
    cloud_name: cloudinary_config.cloud_name,
    api_key: cloudinary_config.api_key,
    api_secret: cloudinary_config.api_secret
});

const handleAddTags = async () => {
    try {
        console.log('bat dau them tag')
        const result = await Attachment.findAll({ where: { tags: null } })

        if (result) {
            for (let attachment of result) {
                const imgPath = storage.storage + attachment.dataValues.path
                let tags
                await cloudinary.uploader.upload(imgPath,
                    function (result) {
                        tags = result.tags
                    },
                    {
                        public_id: "temp",
                        categorization: cloudinary_config.autoTagging_type,
                        auto_tagging: 0.5
                    });

                await Attachment.update({ tags }, { where: { id: attachment.dataValues.id } })
            }
        }

        console.log('ket thuc them tag')
    } catch (err) {
        console.log('err: ', err)
    }
}

const addTags = () => {
    var job = new CronJob('*/10 * * * * *', handleAddTags, null, true, 'America/Los_Angeles');
    job.start();
}

module.exports = addTags