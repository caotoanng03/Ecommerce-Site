const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// Override [POST] method
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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

// Routes
routeClient(app);
routeAdmin(app);

// Global variables
app.locals.prefixAdmin = systemConfig.prefixPathAdmin;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
}); 