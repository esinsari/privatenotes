const express = require('express');
const router = express.Router();

//Create Routes
// app.get --> to get information
// app.post --> to give information
// app.patch --> to update information
// app.delete --> to delete information


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/logout', (req, res) => {
    res.render('index');
});

router.get('/edit', (req, res) => {
    res.render('edit');
});

router.get('/editnote', (req, res) => {
    res.render('editnote');
});

router.get('/note', (req, res) => {
    res.render('note');
});

router.get('/display', (req, res) => {
    res.render('display');
});

router.get('/delete', (req, res) => {
    res.render('delete');
});

router.get('/category', (req, res) => {
    res.render('category');
});

router.get('/date', (req, res) => {
    res.render('date');
});

module.exports = router;