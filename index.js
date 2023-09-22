const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// Override [POST] method
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Config 
const systemConfig = require('./config/system');
const database = require('./config/database.js');

database.connect();

// Routes
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

// Static files
app.use(express.static('public'));

// Views 
app.set('views', './views');
app.set('view engine', 'pug');

// Flash
app.use(cookieParser('FATMANNNN'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// Routes
routeClient(app);
routeAdmin(app);

// Global variables
app.locals.prefixAdmin = systemConfig.prefixPathAdmin;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});



