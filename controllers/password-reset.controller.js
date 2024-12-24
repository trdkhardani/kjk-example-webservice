const Router = require('express-promise-router');
const router = Router();

const bcrpyt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');

const Dotenv = require('dotenv');
const dotenv = Dotenv.config();
// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const { JWT_SECRET_KEY, EMAIL } = process.env

const sendEmail = require('../libs/nodemailer');

router.post('/forget', async (req, res, next) => {
    try {
        const userEmail = req.body.user_email;

        const user = await prisma.user.findUnique({
            where: {
                user_email: userEmail
            }
        })

        if(!user){
            throw {
                statusCode: 404,
                message: `User with email ${userEmail} not found`
            }
        }

        let token = jwt.sign({user_email: userEmail}, JWT_SECRET_KEY, {expiresIn: '3m'})
    
        const resetPasswordURL = `http://${req.get('host')}/reset-password-${token}`
    
        const mailOptions = {
        from: EMAIL,
        to: userEmail,
        subject: "Password Reset",
        html: `
        <p>Hello, ${user.user_name}</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetPasswordURL}">Reset Password</a>
        <p>Please note that the link will only be valid for <b>3 minutes</b></p>
        `
        }
    
        sendEmail(mailOptions)
        // console.log(mailOptions);
    
        return res.send(`Email has been sent to ${userEmail}`);
    } catch(err) {
        if(err.statusCode){
            return res.status(err.statusCode).render('error.ejs', {
                message: err.message,
                backURL: '/email-confirmation'
            })
        }
        next(err)
    }
})

router.post('/reset', async (req, res, next) => {
    // const token = req.params.token;
    try {
        const {
            user_email,
            user_new_password,
            retype_new_user_password
        } = req.body

        if(user_new_password !== retype_new_user_password){
            return res.send("Password does not match")
        }

        const hashedNewPassword = await bcrpyt.hash(user_new_password, 10)

        const user = await prisma.user.update({
            where: {
                user_email: user_email
            },
            data: {
                user_password: hashedNewPassword
            }
        })

        return res.redirect('/login?status=password_changed')
    } catch(err) {
        if(err.statusCode){
            return res.status(err.statusCode).json({
                status: 'error',
                message: err.message
            })
        }
    }
})

module.exports = router;