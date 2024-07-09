const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to the database
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database Connection Successful!'));

// Connecting routes
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
app.use('/api/v1/user/', userRouter)
app.use('/api/v1/product/', productRouter);

app.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
