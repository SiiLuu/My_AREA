const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const initWorker = require('./src/workers/init');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, jwt');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

initWorker()

app.use(bodyParser.json());

const usersRouter = require('./routes/UserRouter.js');

app.use('/api/user', usersRouter);

const facebookRouter = require('./routes/FacebookRouter.js');

app.use('/api/facebook', facebookRouter);

const githubRouter = require('./routes/GithubRouter.js');

app.use('/api/github', githubRouter);


const composantRouter = require('./routes/ComposantRouter.js');

app.use('/api/composant', composantRouter);

const serviceRouter = require('./routes/ServiceRouter.js');

app.use('/api/service', serviceRouter);

const about = require('./src/about');

app.use('', about);

module.exports = app;