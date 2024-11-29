require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const { connectDB } = require('./config/dbConfig');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(logger);

const port = process.env.PORT;

connectDB();

app.use('/books', require('./routes/bookRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/library', require('./routes/libraryFunctionRoutes'));
app.use('/newBook', require('./routes/unavailableBooksRoutes'));

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});
