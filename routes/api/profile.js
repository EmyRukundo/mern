const express = require('express');
const router = express.Router();
//@router Get api/profile
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('profile route'));


module.exports = router;