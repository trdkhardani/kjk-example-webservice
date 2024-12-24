const nodemailer = require('nodemailer');

const Dotenv = require('dotenv');
const dotenv = Dotenv.config();

const {
    EMAIL,
    APP_PASSWORD
} = process.env

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: APP_PASSWORD
    }
})

// const mailOptions = {
//     from: '',
//     to: '',
//     subject: "",
//     text: ""
// }

const sendEmail = (mailOptions) => {
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            throw err;
        } else {
            console.log(`Email sent: ${info.response}`)
        }
    })
}

module.exports = sendEmail;