module.exports = (sequelize, Sequelize) => {
    const Pricing = sequelize.define('Pricing', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            pricingName: {   //CRUD
                type: Sequelize.STRING,
                field: 'pricing_name'
            },
            storage: {
                type: Sequelize.INTEGER,
                field: 'storage'
            },
            price: {
                type: Sequelize.STRING,
                field: 'price'
            },
            createdAt: { 
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: { 
                type: Sequelize.DATE,
                field: 'updated_at'
            },
        }, 
        {
            tableName: 'pricings',
            timestamps: true,
            underscored: true,
        }
    )
     
    return Pricing
}