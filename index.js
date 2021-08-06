const http = require('http');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/user');
const contactsRoutes = require('./routes/contacts');

const app = express();
dotenv.config();
const port = process.env.PORT;

const corsConfig = {
    origin: `*`,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaaders: ['Content-Type', 'Authorization', 'Set-Cookie']
}

app.use(cors(corsConfig));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get("/jsonapi/test", (req, res, next) => {

    res.json('Test Data')
})


app.use('/jsonapi/user', userRoutes);
app.use('/jsonapi/contacts', contactsRoutes);


app.use((err, req, res, next) => {
    const response = {
        statusCode: 500,
        message: 'Server Error',
        error: err
    }
    res.status(200).json(response)
});

app.use((req, res, next) => {
    const response = {
        statusCode: 404,
        message: 'Not Found',
        error: "The endpoint is not found"
    }
    res.status(200).json(response)
});

http.createServer(app).listen(port, () => {
    console.log(`The server is running on port ${port}`);
})


