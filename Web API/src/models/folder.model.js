
module.exports = (sequelize, Sequelize) => {
    const folder = sequelize.define('folders', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        folderName: {
            type: Sequelize.STRING,
            field: 'folder_name'
        },
        projectId: {
            type: Sequelize.INTEGER
        },
        // parentId: {
        //     type: Sequelize.INTEGER,
        //     allowNull: true,
        //     defaultValue: null
        // },
        deleted: {
            type: Sequelize.BOOLEAN,
            field: 'deleted',
            defaultValue: false
        }
    },
        {
            timestamps: true,
            underscored: true,
            tableName: 'folders'
        })

    return folder
}


