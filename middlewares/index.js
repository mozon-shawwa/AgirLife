const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

module.exports = {
    global: (app) => {
        app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        app.use(express.json({ limit: "10mb" }));
        app.use(express.urlencoded({ extended: true , limit: "10mb"}));
        app.use(morgan('dev'));
    },
    auth: require('./auth'),
    admin: require('./admin')
}