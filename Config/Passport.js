const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      async (email, password, done) => {
        // Match the User
        let user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: 'No User found with this email'
          });
        }

        // Match Password
        let isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
          return done(null, false, { message: 'Password is incorrect' });
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
