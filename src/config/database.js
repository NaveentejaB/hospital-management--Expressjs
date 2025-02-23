require('dotenv').config()

const {Sequelize} = require('sequelize-cockroachdb');


let sequelize = new Sequelize(process.env.cockroachDBURL, 
    { logging: false }
);


async function connectDB() {
  try {
    await sequelize.authenticate();
    console.info('CockroachDB connected');
  } catch (error) {
    console.error('CockroachDB connection error:', error);
    throw error; // Propagate error to handle in the main application logic
  }
}

async function disconnectDB() {
  try {
    if (sequelize) {
      await sequelize.close();
      console.info('CockroachDB disconnected');
    }
  } catch (error) {
    console.error('CockroachDB disconnection error:', error);
  }
}

module.exports = { connectDB, disconnectDB, sequelize };
