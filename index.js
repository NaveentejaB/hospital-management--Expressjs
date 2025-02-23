// require('dotenv').config();
const App = require('./src/app');


async function main() {
    const app = new App();
    try{
        await app.initialize();
        await app.start();
    }catch(err){
        console.error('Failed to start the application: ', err);
        process.exit(1);
    };
};

main();