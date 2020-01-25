const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('welcome');
});

module.exports = router;
