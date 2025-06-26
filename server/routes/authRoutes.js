const express = require('express')
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs')



router.post('/login', (req, res, next) => {
  
  passport.authenticate('local', (err, user, info) => {
    if(err) return next(err)
    if(!user) return res.status(401).json({ message: info.message || 'Login failed'})
    req.login(user, (err)=> {
      
      if (err) return next(err)
        return res.json({ message : 'Login successful', user})
      })
  }) (req, res, next) //2nd parantheses immediately executes it. 
})

router.post('/signup', async (req, res, next) => {

  try{

    const email = req.body.email
      const existingUser = await User.findOne({email, provider: 'local'})
      if (existingUser) return res.status(400).json({message: 'User already exists'})
      

        const newUser = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10),
            provider: 'local'
        })

        req.login(newUser, (err)=> {
          if (err) return next(err)
          return res.json({ message : 'User created and login successful', newUser})
          })

        
        
  } catch(err){res.status(500).json({ message: 'Error creating user', error: err.message})}
})


router.get('/logout',(req, res)=> {

  req.logout(()=> {

    req.session.destroy((err) => {
      if(err) return res.status(500).json({message: 'Logout not successful'})
      res.clearCookie('connect.sid')
      res.json({message: 'Logged out successfully'})
    })
  })
})


// Start Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

// Google callback route
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    successRedirect: 'http://localhost:5173/',
  }),
   
);

// Success route
router.get('/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Google login successful', user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Failure route
router.get('/failure', (req, res) => {
  res.status(401).send('Google login failed');
});

module.exports = router;