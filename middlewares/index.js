const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

module.exports = {
    global:(app)=>{
       app.use(cors());
       app.use(express.json());
       app.use(express.urlencoded({ extended: true }));
       app.use(morgan('dev'));
    },
    auth:require('./auth'),
    admin: require('./admin')
}