const express = require('express');
const app = express();

const router = require('./routes/router')

const cookieParser = require('cookie-parser');

const Dotenv = require('dotenv');
const dotenv = Dotenv.config();
const PORT = process.env.PORT

// require("./instrument.js");

// All other imports below
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

const { sokcetioServer } = require('./socketio')

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(router);

Sentry.init({
    dsn: process.env.SENTRY_DSN,
});

app.get('/', (req, res) => {
    return res.render('home.ejs')
})

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use((req, res, next) => {
    res.status(404).render('error.ejs', {
        message: 'Page not found',
        backURL: '/login'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)

    res.status(404).render('error.ejs', {
        message: 'Internal Server Error',
        backURL: '/'
    })
})

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

const server = app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`)
})

sokcetioServer(server);