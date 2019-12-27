const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../routes/middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validdationResult } = require('express-validator');
const User = require('../../models/Users');


//@router Get api/auth
//@desc test route
//@access Public
router.get('/', auth, (req, res) =>{
    try {
          const user = await User.findById(req.user.id).select('-password');
          res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } 
});
 //@route POST api/auth
 //@desc Authenticate user & get token
 // @access Public 

router.post('/',[
    check('email', 'Please incluse a valid email').isEmail(),
    check('password', 'Password is required').exists({
        min: 6 
    })
], 
 async (req, res) => {
    const errors = validdationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()}); 
    }
         const { email, password} = req.body;

         try {
            // see if user exists

            let user = await User.findOne ({ email });

            if(user){
                 return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
            }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch){
          return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }]});
      }

    //Return jsonwebtoken
    const payload = {
        user: {
            id: user.id
        }
    }
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        {
         expiresIn: 360000
        },
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        });
         } catch(err){
              console.error(err.message);
              res.status(500).send('server error');
         }
});
module.exports = router;
