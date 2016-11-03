const router = require('express').Router({ mergeParams: true });

router.use('/:id/spam-flags', require('./spam-flags'));

module.exports = router;
