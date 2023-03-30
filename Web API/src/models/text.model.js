module.exports = (sequelize, Sequelize) => {
    const Text = sequelize.define('Text', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fontFamily:{
                type: Sequelize.STRING,
                field: 'font_family'
            },
            fontSize:{
                type: Sequelize.INTEGER,
                field: 'font_size'
            },
            fontWeight:{
                type: Sequelize.INTEGER,
                field: 'font_weight'
            },
            text:{
                type: Sequelize.TEXT,
                field: 'text'
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
            tableName: 'text',
            timestamps: true,
            underscored: true,
        }
    );
    return Text
};