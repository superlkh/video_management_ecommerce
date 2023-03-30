module.exports = (sequelize, Sequelize) => {
    const Shape = sequelize.define('Shape', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            templateId:{
                type: Sequelize.INTEGER,
                field: 'template_id'
            },
            width:{
                type: Sequelize.FLOAT,
                field: 'width'
            },
            height:{
                type: Sequelize.FLOAT,
                field: 'height'
            },
            color:{
                type: Sequelize.STRING,
                field: 'color'
            },
            createdAt: { 
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: { 
                type: Sequelize.DATE,
                field: 'updated_at'
            }
        }, 
        {
            tableName: 'shapes',
            timestamps: true,
            underscored: true,
        }
    );
    return Shape
};