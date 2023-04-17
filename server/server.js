const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const cards = require('./routes/api/cards');
const passport = require('passport'); 
const cors = require('cors');
const methodOverride = require('method-override');

//const path = require('path');


 
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(methodOverride('_method')); 

//FOR POINTING dependencies for index.html in build
//app.use(express.static(path.join(__dirname, 'build')))

const db = require('./config/keys').mongoURI;

// connect to mongoDB through mongoose
mongoose
    .connect(db)
    .then(() => console.log(`connected to ${db}`))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);//


//app.get('/', (req, res) => res.send("Hello World"));
//app.get('/ping', (req, res) => res.json("pong"));


// USE routes
app.use('/api/users', users);
app.use('/api/cards', cards);


// FOR pointing node to the build folder index.html
/* app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
}); */

  

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
