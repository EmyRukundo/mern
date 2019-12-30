const express = require('express');
const router = express.Router();
const auth = require('../../routes/middleware/auth');
const profie = require('../../models/Profile');
const User = require('../../models/Users');



//@router Get api/profile
//@desc Get current user profie
//@access Private 
router.get('/me', auth, async (req, res) =>{
    try{
        const profie = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profie){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;