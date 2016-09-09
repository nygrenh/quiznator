const router = require('express').Router();

router.get('/script.js',
  (req, res, next) => {
    res.render('plugin-script', { pluginScriptUrl: process.env.PLUGIN_SCRIPT_URL, pluginStyleUrl: process.env.PLUGIN_STYLE_URL, layout: false });
    res.setHeader('Content-Type', 'application/javascript');
  });

module.exports = router;
