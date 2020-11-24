const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/note', authController.note);

router.post('/edit', authController.edit);

router.post('/editnote', authController.editnote);

router.post('/display', authController.display);

router.post('/delete', authController.delete);

router.post('/home', authController.home);

router.post('/category', authController.category);

router.post('/date', authController.date);

module.exports = router;