const Router = require('express-promise-router');
const router = Router();

const authMiddleware = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');

const Dotenv = require('dotenv');
const dotenv = Dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.get('/email-confirmation', async (req, res, next) => {    
    res.render('email-confirmation.ejs')
});

router.get('/reset-password-:token', async (req, res, next) => {
    const token = req.params.token;
    try {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if(err){
                throw {
                    statusCode: 401,
                    message: err.message
                }
            }

            req.user = decoded;

        })
        
        const userData = {
            email: req.user.user_email
        };

        return res.render('reset-password.ejs', userData)
    } catch(err) {
        if(err.statusCode){
            // return res.status(err.statusCode).json({
            //     status: 'error',
            //     message: err.message
            // })
            return res.status(err.statusCode).render('error.ejs', {
                message: err.message,
                backURL: '/'
            })
        }
    }
})

module.exports = router;