// Importing Dependencies
const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport Config
require('./Config/Passport')(passport);

// Configuring Needed Variables
const port = process.env.PORT || 5000;
const { mongoURI } = require('./Config/keys');

// Database Connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err);
  });

// Setting Body Parser
app.use(express.urlencoded({ extended: false }));

// Setting up Express Sessions
app.use(
  session({
    secret: 'badboysecurities',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Setting View Engine
app.use(expressLayout);
app.set('view engine', 'ejs');

// Serving Public folder as default
app.use(express.static('Public'));

// Routes are imported here
const IndexRouter = require('./Routes/index');
const UserRouter = require('./Routes/user');

app.use(IndexRouter);
app.use('/users', UserRouter);

// Creating Server
app.listen(port, (err) => {
  if (err) {
    console.log(`SERVER ERROR : ${err}`);
  } else {
    console.log(`Server Started : ${port}`);
  }
});
