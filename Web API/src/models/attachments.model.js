const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Attachment = sequelize.define('Attachment', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            uuid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                unique: true
            },
            originalFileName: {
                type: Sequelize.STRING,
                field: 'original_file_name'
            },
            fileName: {
                type: Sequelize.STRING,
                field: 'file_name'
            },
            url: {
                type: Sequelize.STRING,
                field: 'url'
            },
            path: {
                type: Sequelize.STRING,
                field: 'path'
            },
            thumbnailName: {
                type: Sequelize.STRING,
                field: 'thumbnail_name'
            },
            thumbnailUrl: { 
                type: Sequelize.STRING,
                field: 'thumbnail_url'
            },
            publish: {
                type: Sequelize.BIGINT,
                field: 'publish'
            },
            size: {
                type: Sequelize.BIGINT,
                field: 'size'
            },
            mimetype: {
                type: Sequelize.STRING(64),
                field: 'mimetype'
            },
            createdAt: { 
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: { 
                type: Sequelize.DATE,
                field: 'updated_at'
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                field: 'deleted',
                defaultValue: false
            },
            nudity: {
                type: Sequelize.INTEGER,
                field: 'nudity',
                defaultValue: 0
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: 'tags',
            },
            createUid: {
                type: Sequelize.STRING,
                field: 'create_uid'
            },
            updateUid: {
                type: Sequelize.STRING,
                field: 'update_uid'
            },
            folderId:{
                type: Sequelize.INTEGER
            }
        }, 
        {
            tableName: 'attachments',
            timestamps: true,
            underscored: true,
        }
    );
    return Attachment
};