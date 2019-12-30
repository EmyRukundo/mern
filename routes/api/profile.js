const express = require('express');
const router = express.Router();
const auth = require('../../routes/middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');



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

//@router POST api/profile
//@desc create or update user profie
//@access Private  

router.post('/',[ auth,
     [
    check('status', 'status is required')
    .not()
    .isEmpty(),
    check('skills', 'skills is required')
    .not()
    .isEmpty()
     ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        } 
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            linkedin
        } = req.body;
        //Build profile object

        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.company = website;
        if(location) profileFields.company = location;
        if(bio) profileFields.company = bio;
        if(status) profileFields.company = status;
        if(githubusername) profileFields.company = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        // Build social object 
        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(linkedin) profileFields.social.linkedin = linkedin;
        try {
         let profile = await Profile.findOne({ user: req.user.id });
         if(profile) {
             // Update
             profile = await  Profile.findOneAndUpdate(
                 { user: req.user.id },
                  { $set: profileFields}, 
                  { new : true }
                  );

                  return res.json(profile);
         }
         // create 
         profile = new Profile(profileFields);
         await profile.save();
         res.json(profile);
        }catch(err){
            console.error(err.message);
            res.status(500).send('Server  Error');
        }
}
);

//@router Get api/profile
//@desc Get all profie
//@access Public



router.get('/', async (req, res) => {
    try{
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;