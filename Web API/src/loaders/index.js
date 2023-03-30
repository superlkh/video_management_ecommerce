const expressLoader = require('./express');
const sequelize = require('./sequelize')

async function loaders({ expressApp }) {

  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection successfully.');
    })
    .catch(err => {
      console.error('Connect failed! Due to error: ', err);
    });

  await expressLoader({ app: expressApp });
  console.log('Express Initialized');
}

module.exports = loaders