// Role model 
// Read https://sequelize.org/master/manual/model-basics.html to understand

module.exports = (sequelize, Sequelize) =>{
    const Role = sequelize.define('roles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    },{
        timestamps: false,
        underscored: true,
    })

    return Role
}