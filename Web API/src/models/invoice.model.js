module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define('Invoice', {
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
            status: { //0: Unpaid, 1: Paid, -1: Cancelled
                type: Sequelize.INTEGER,
                field: 'status'
            },
            createdAt: { 
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: { 
                type: Sequelize.DATE,
                field: 'updated_at'
            },
            paymentDate: {
                type: Sequelize.DATE,
                field: 'payment_date'
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'user_id'
            },
            pricingId: {
                type: Sequelize.INTEGER,
                field: 'pricing_id'
            }
        }, 
        {
            tableName: 'invoices',
            timestamps: true,
            underscored: true,
        }
    )
     
    return Invoice
}