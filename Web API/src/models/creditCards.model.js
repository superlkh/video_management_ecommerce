module.exports = (sequelize, Sequelize) => {
    const CreditCard = sequelize.define('CreditCard', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            cardNumber: {   //CRUD
                type: Sequelize.BIGINT,
                field: 'card_number',
                unique: true
            },
            cardName: {
                type: Sequelize.STRING,
                field: 'card_name'
            },
            cvc: {
                type: Sequelize.INTEGER,
                field: 'cvc'
            },
            date: {
                type: Sequelize.STRING,
                field: 'date'
            },
            balance: {
                type: Sequelize.BIGINT,
                field: 'balance'
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
            tableName: 'credit_cards',
            timestamps: true,
            underscored: true,
        }
    )
     
    return CreditCard
}