const express = require('express');
const passport = require('passport');

const router = express.Router();

// // Google login route
// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google callback route
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/'); // Redirect after successful login
//   }
// );



// Google OAuth Route
router.post('/google', passport.authenticate('google', { session: false }), (req, res) => {
    // If passport authentication is successful, the user is authenticated
    if (req.user) {
      // Send back user info or token as needed
      res.json({
        message: 'Login successful',
        user: req.user, // This will include the user's information (e.g., id, email)
      });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });
  

module.exports = router;
