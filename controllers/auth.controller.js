const Router = require('express-promise-router');
const router = Router();

const bcrpyt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');

const Dotenv = require('dotenv');
const dotenv = Dotenv.config();
const { JWT_SECRET_KEY } = process.env

router.post('/register', async (req, res, next) => {
    try {
        const userPassword = req.body.user_password;
        let hashedPassword = await bcrpyt.hash(userPassword, 10);
    
        const user = await prisma.user.create({
            data: {
                user_name: req.body.user_name,
                user_password: hashedPassword,
                user_email: req.body.user_email,
            }
        })
    
        res.redirect('/login?status=new_user')
    } catch(err) {
        if(err.code === 'P2002'){
            return res.status(404).render('error.ejs', {
                message: 'Email has been taken',
                backURL: '/login'
            })
        }
        next(err);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const userPassword = req.body.user_password;

        let user = await prisma.user.findUnique({
            where: {
                user_email: req.body.user_email
            }
        })

        if(!user){ // if no email found from the request body
            throw {
                statusCode: 400,
                message: `Invalid email or password`
            }
        }

        let isPasswordCorrect = await bcrpyt.compare(userPassword, user.user_password)

        if(!isPasswordCorrect){ // if entered password is false or incorrect
            throw {
                statusCode: 400,
                message: `Invalid email or password`
            }
        }

        let token = jwt.sign({ user_id: user.user_id, user_email: user.user_email, user_name: user.user_name }, JWT_SECRET_KEY, {expiresIn: '3h'})

        res.cookie('token', token, {
                httpOnly: true
        })
        res.redirect('/authenticate')
    } catch(err) {
        if(err.statusCode){
            return res.status(err.statusCode).render('error.ejs', {
                message: err.message,
                backURL: '/login'
            })
        }
        next(err)
    }
})

router.get('/logout', (req, res) => {
    try {
        // Clear the JWT token cookie
        res.clearCookie('token', {
            httpOnly: true
        });

        // Redirect to login page after logout
        res.redirect('/login?status=logged_out');
    } catch (err) {
        res.status(500).render('error.ejs', {
            message: 'An error occurred while logging out',
            backURL: '/'
        });
    }
});

module.exports = router;