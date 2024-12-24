const jwt = require('jsonwebtoken');

const Dotenv = require('dotenv');
const dotenv = Dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const express = require('express');
const app = express();

app.use(async function(req, res, next){
    // const { authorization } = req.headers;
    const token = req.cookies.token;
    
    try {
        if(!token){
            throw {
                statusCode: 401,
                message: `Unauthorized`
            }
        }
        
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if(err){
                throw {
                    statusCode: 401,
                    message: err.message
                }
            }
    
            req.user = decoded;
            next();
        })
    } catch(err) {
        if(err.statusCode){ // throw error block
            return res.status(err.statusCode).redirect('/login')
        }
        next(err);
    }
})

module.exports = app;