const router = require('express').Router();

router.get('/',
  (req, res, next) => {
    res.render('sign-up', { layout: false });
  });

module.exports = router;
