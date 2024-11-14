require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/dbConfig');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

const port = process.env.PORT;

connectDB();

app.use('/books', require('./routes/bookRoutes'));
app.use('/auth', require('./routes/authRoutes'));

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});
