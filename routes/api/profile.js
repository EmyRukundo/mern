const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
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
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@router Get api/profile/user/:user_id
//@desc Get profile bu user ID
//@access Public

router.get('/user/:user_id', async (req, res) => {
    try{
        const profile  = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({ msg: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
})

//@router DELETE api/profile
//@desc delete all profile, user $ posts
//@access Public

router.delete('/', async (req, res) => {
    try{
        // Remove Profile
         await Profile.findOneAndRemove({ user: req.user.id});
        //Remove user
         await User.findOneAndRemove({ _id: req.user.id});

        res.json({ msg: 'User removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}) 

//@router PUT api/profile/experience
//@desc Add profile expereince
//@access Private

router.put(
    '/experience',
    [
     auth,
     [
check('title', 'Title is required')
.not()
.isEmpty(),
check('company', 'company is required')
.not()
.isEmpty(),
check('from', 'From date is required')
.not()
.isEmpty()
]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            decription
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            decription
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id  });

            profile.experience.unshit(newExp);
            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(5000).send('Server Error');
        }
    }
    );

//@router DELETE api/profile/experience/:exp_id
//@desc delete experience from profile
//@access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try{
             const profile = await Profile.findOne({ user: req.user.id });

             // Get remove index
             const removeIndex = profile.experience.map(item => item.id).indexOf
             (req.params.exp_id);
             profile.experience.splice(removeIndex, 1);

             await profile.save();
             res.json(profile);
    } catch (err){
        console.error(err.message);
        res.status(500).send('server Error');
    }
});

//@router PUT api/profile/education
//@desc Add profile expereince
//@access Private

router.put(
    '/education',
    [
     auth,
     [
check('school', 'school is required')
.not()
.isEmpty(),
check('degree', 'Degree is required')
.not()
.isEmpty(),
check('field', 'From field is required')
.not()
.isEmpty(),
check('from', 'From date is required')
.not()
.isEmpty()
]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            decription
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            decription
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id  });

            profile.education.unshit(newEdu);
            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(5000).send('Server Error');
        }
    }
    );

//@router DELETE api/profile/education/:edu_id
//@desc delete education from profile
//@access Private
router.delete('/education/:exp_id', auth, async (req, res) => {
    try{
             const profile = await Profile.findOne({ user: req.user.id });

             // Get remove index
             const removeIndex = profile.education.map(item => item.id).indexOf
             (req.params.edu_id);
             profile.education.splice(removeIndex, 1);

             await profile.save();
             res.json(profile);
    } catch (err){
        console.error(err.message);
        res.status(500).send('server Error');
    }
});
//@router GET api/profile/github/:username
//@desc Get user repos from github
//@access public

router.get('github/:username', (req, res) => {
    try {
         const options = {
             uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc$
             client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
             method: 'GET',
             headers: { 'user-agent': 'node.js'}
         };
         request(options, (erro, response, body) => {
             if(error) console.error(error);

             if(response.statusCode !==200){
                 res.status(404).json({ msg: 'No Github profie found'});
             }
             res.json(JSON.parse(body));
         });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


module.exports = router;
 