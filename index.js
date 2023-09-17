const express = require('express');
require("dotenv").config();

// Congig 
const systemConfig = require('./config/system');
const database = require('./config/database.js');

database.connect();

// Routes
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const app = express();
const port = process.env.PORT;

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