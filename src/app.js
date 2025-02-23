require('dotenv').config();
const express = require("express");
const cors = require("cors");
require("express-async-errors");
const {connectDB,disconnectDB,sequelize} = require("./config/database");
const initializeRelationships = require("./models/Relationships")
const UserRoutes = require("./routes/UserRoutes");
const PatientRoutes = require("./routes/PatientRoutes");
const DoctorRoutes = require("./routes/DoctorRoutes");
const MappingRoutes = require("./routes/MappingRoutes");
const BASE_PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', // Update with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable CORS credentials (cookies, authorization headers, etc.)
    allowedHeaders: 'Content-Type,Authorization',
};

class App {
    constructor(){
        this.app = express();
    };
    async initialize(){
        try{
            await connectDB();
            await sequelize.sync();
            initializeRelationships();
            this.setMiddlewares();
            this.setRoutes();
            this.app.get("\test",(req,res)=>{
                res.send("Hello I am running...");
            });
            
            console.info('App initialized successfully');
        }catch(err){
            console.error('Error initializing app: ', err);
            process.exit(1);
        };
    };

    setMiddlewares(){
        this.app.use(express.json());
        this.app.use(cors(corsOptions));
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.static('public'));
        this.app.use((err, req, res, next) => {
            return res.status(err.status || 500).json({
                message : err.message || `Internal server error!`,
                success : false,
                status: 'error'
            })
        });
    };

    setRoutes(){
        this.app.use('/api/auth',UserRoutes);
        this.app.use('/api/patients',PatientRoutes);
        this.app.use('/api/doctors',DoctorRoutes);
        this.app.use('/api/mappings',MappingRoutes);
    };

    async start(){
        try{
            this.server = this.app.listen(BASE_PORT,()=>{
                console.info('Server started on port: ', BASE_PORT);
            })
            console.info('App started successfully');
        }catch(err){
            console.error(`Failed to start on port ${BASE_PORT}:`, err);
            process.exit(1);
        };
    };

    async stop(){
        try{
            await disconnectDB();
            if(this.server){
                this.server.close(()=>{
                    console.info('Server stopped');
                    process.exit(0);
                });
            }else{
                console.info('Server was not running');
                process.exit(0);
            };
        }catch(err){
            console.error('Error during server shutdown: ', err);
            process.exit(1);  
        };
    };

};

process.on('SIGINT',()=>{
    console.info('SIGINT signal received.');
    this.stop();
    new App().stop();
});

process.on('SIGTERM',()=>{
    console.info('Received SIGTERM. Shutting down gracefully.');
    this.stop();
    new App().stop();
});


module.exports = App;
