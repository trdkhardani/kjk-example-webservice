const express = require('express');
const app = express();

const authController = require('../controllers/auth.controller');
const authViewController = require('../controllers/auth.view');

const passwordResetViewController = require('../controllers/password-reset.view');
const passwordResetController = require('../controllers/password-reset.controller');

app.use('/', authViewController);
app.use('/api/v1/auth', authController)

app.use('/', passwordResetViewController);
app.use('/api/v1/password', passwordResetController)

module.exports = app;