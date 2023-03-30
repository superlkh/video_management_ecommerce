module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define('Project', {
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
            projectName: {
                type: Sequelize.STRING,
                field: 'project_name'
            },
            tag:{
                type: Sequelize.STRING,
                field: 'tag'
            },
            description: {
                type: Sequelize.STRING,
                field: 'description'
            },
            url: {
                type: Sequelize.STRING,
                field: 'url'
            },
            path: {
                type: Sequelize.STRING,
                field: 'path'
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
            userId:{
                type: Sequelize.INTEGER
            }
        }, 
        {
            tableName: 'projects',
            timestamps: true,
            underscored: true,
        }
    );
    return Project
};