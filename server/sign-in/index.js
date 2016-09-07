const router = require('express').Router();

router.get('/',
  (req, res, next) => {
    res.render('sign-in', { layout: false });
  });

module.exports = router;
