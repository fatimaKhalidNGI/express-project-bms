const morgan = require('morgan');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs', 'access.log');

const ensureLogFolder = async() => {
    try{
        const logsDir = path.dirname(logFilePath);
        await fsPromises.mkdir(logsDir, { recursive : true });
    } catch(error){
        console.log("Error in creating logs directory: ", error);
    }
}

const createAccessLogStream = async() => {
    try {
      await ensureLogFolder();
      return fs.createWriteStream(logFilePath, { flags: 'a' }); // Append mode
    } catch (err) {
      console.error('Error creating log stream:', err);
      throw err;
    }
  }

const logger = async (req, res, next) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        const accessLogStream = await createAccessLogStream();
        morgan('combined', { stream: accessLogStream })(req, res, next);
      } else {
        morgan('dev')(req, res, next);
      }
    } catch (err) {
      console.error('Error in logger:', err);
      next();
    }
};

module.exports = logger;