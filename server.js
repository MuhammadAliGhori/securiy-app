 const express = require('express')
 const path = require('path')
 const mongoose = require('mongoose')
 const cors = require('cors')
 const bodyParser = require('body-parser')
 const dbConfig = require('./db/database');
    const createError = require('http-errors');
    const wiki = require("./router");
    // Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true
}).then(() => {
        console.log('Database connected')
    },
    error => {
        console.log('Database could not be connected : ' + error)
    }
)
// Setting up express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use("/wiki", wiki);

// Api root
const userRoute = require('./routes/route')
app.use('/endpoint', userRoute)
// Create port
const port = process.env.PORT || 8080;
// Conectting port
const server = app.listen(port, () => {
    console.log('Port connected to: ' + port)
})
// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// Index Route
app.get('/', (req, res) => {
    res.send('invaild endpoint');
});
// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

// …

// Static build location
app.use(express.static(path.join(__dirname, 'dist')));