const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');
const path = require('path');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
require("dotenv").config();
const port = process.env.PORT;

// Override [POST] method
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Config 
const systemConfig = require('./config/system');
const database = require('./config/database.js');

database.connect();

// Routes
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Views 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// Flash
app.use(cookieParser('FATMANNNN'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// tinyMCE
app.use(
    '/tinymce',
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

// Routes
routeClient(app);
routeAdmin(app);
app.get('*', (req, res) => {
    res.render('client/pages/errors/404', {
        pageTitle: '404 Not Found',
    });
});

// Global variables
app.locals.prefixAdmin = systemConfig.prefixPathAdmin;
app.locals.moment = moment;

server.listen(port, () => {
    console.log(`App running on port ${port}`);
});



