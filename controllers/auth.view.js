const Router = require('express-promise-router');
const router = Router();

const authMiddleware = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');

const Dotenv = require('dotenv');
const { getIo } = require('../socketio.js');
const dotenv = Dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.get('/register', async (req, res, next) => {
    const { cookie } = req.headers

    if(cookie){
        return res.redirect('authenticate')
    }
    
    res.render('register.ejs')
});

router.get('/login', async (req, res, next) => {
    const { cookie } = req.headers

    if(cookie){
        return res.redirect('authenticate')
    }

    const queryParam = req.query.status;
    // const queryParamChangePassword = req.query.password_changed;
    
    // check for the "just_registered" flag in the query string
    if (queryParam) {
        return res.render('login.ejs', {queryParam: queryParam})
    } 
    // else if(queryParamChangePassword) {
    //     return res.render('login.ejs', {queryParam: queryParam})
    // }

    return res.render('login.ejs', {queryParam: ''})
})

router.get('/authenticate', authMiddleware, async (req, res, next) => {
    const name = req.user.user_name
    res.render('dashboard.ejs', {name: name})
})

module.exports = router;