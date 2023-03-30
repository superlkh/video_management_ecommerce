module.exports = (sequelize, Sequelize) => {
    const Element = sequelize.define('Element', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            designId:{
                type: Sequelize.INTEGER,
                field: 'design_id'
            },
            elementableId:{
                type: Sequelize.INTEGER,
                field: 'elementable_id'
            },
            elementableType: {
                type: Sequelize.STRING,
                field: 'elementable_type'
            },
            posX:{
                type: Sequelize.FLOAT,
                field: 'pos_x'
            },
            posY:{
                type: Sequelize.FLOAT,
                field: 'pos_y'
            },
            zIndex: {
                type: Sequelize.INTEGER,
                field: 'z_index'
            },
            transparency: {
                type: Sequelize.FLOAT,
                field: 'transparency'
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
            tableName: 'elements',
            timestamps: true,
            underscored: true,
        }
    );
    return Element
};