var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var app = express();
var mongoose = require('mongoose')

var db = 'mongodb://localhost/grapeExample'
mongoose.connect(db);
mongoose.Promise = global.Promise;

// instantiate bodyParser middleware so we can get fields from post requests via req.body.fieldName
app.use(bodyParser.urlencoded({ extended: true }));
// instatiate bodyParser to also handle requests with JSON and not just form data
app.use(bodyParser.json());
app.set('superSecret', 'grapevine');
 
const accountRoutes = require('./api/account');
app.use('/account', accountRoutes(app))

const postRoutes = require('./api/post');
app.use('/post', postRoutes(app))

const schoolRoutes = require('./statics/uploadSchools');
app.use('/kernal', schoolRoutes(app))

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on ' + (process.env.PORT || 3000));
});
