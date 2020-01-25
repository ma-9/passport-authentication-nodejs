const router = require('express').Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

// @route   GET /users/login
// @desc    Login Page
// @access  public
router.get('/login', (req, res) => {
  res.render('login');
});

// @route   GET /users/register
// @desc    Registration Page
// @access  public
router.get('/register', (req, res) => {
  res.render('register');
});

// @route   POST /users/register
// @desc    Register the User
// @access  public
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all the fields' });
  }

  // Check the password
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }

  // Check passwords length
  if (password.length < 6) {
    errors.push({ msg: 'Password should have at lease 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 });
  } else {
    // Validation passed
    User.findOne({ email })
      .then((user) => {
        if (user) {
          errors.push({ msg: 'User already exists with same email' });
          res.render('register', { errors, name, email, password, password2 });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
              if (err) throw err;
              // set password to hash
              newUser.password = hashedPassword;
              // Save User
              newUser
                .save()
                .then(() => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
