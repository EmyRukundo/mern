const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mangoURI');

 const connectDb = async () => {
     try {
         mongoose.connect(db, { 
             useUnifiedTopology: true, 
             useNewUrlParser: true,
             userCreateIndex: true
            });
         console.log('MongoDB Connected..');
     } catch(err){
          console.error(err.message);
          //Exit process with failure
          process.exit( 1);
     }
 };
 module.exports = connectDb;
