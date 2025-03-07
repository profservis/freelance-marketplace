// C:\Users\Владелец\freelance-marketplace\server\routes\authRoutes.js
const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

// Endpoint для logout: очищает куку jwtToken
router.post('/logout', (req, res) => {
  res.clearCookie('jwtToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
