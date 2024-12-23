const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res, next) => {
    return res.send("Selamat datang di web service DTI!")
})

app.listen(PORT, () => {
    `Listening to port ${PORT}`
})