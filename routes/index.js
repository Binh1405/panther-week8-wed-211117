const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const userRoutes = require("./users")
router.use("/users", userRoutes)


module.exports = router;
