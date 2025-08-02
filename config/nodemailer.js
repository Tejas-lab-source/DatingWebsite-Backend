const { response } = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config()


const auth = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,   
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.GMAIL_PASS // your email password
    },
    tls: {          
        rejectUnauthorized: false // Allow self-signed certificates
    }
});


module.exports = auth;
