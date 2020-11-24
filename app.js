const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv'); // for sensitive data
const  bcrypt = require('bcrypt'); // for hashing password
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'});

const app = express(); // to start server 


// const db or const connection
var connection = mysql.createConnection({
  host: process.env.pn_database_host,
  user: process.env.pn_database_user,
  password: process.env.pn_database_password,
  database: process.env.pn_database,
  port: process.env.pn_database_port
});

//takes 2 parameter to access css, html, and any other file
const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTM forms)
app.use(express.urlencoded({extended: false}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs');

connection.connect(err => {
  if (!err)
  {
    console.log("MySQL Connected");
  } 
  else
  {
    console.log("Connection Failed");
  }
});

/*
//to create table
connection.query('CREATE TABLE user(username VARCHAR(45) NOT NULL, password INT NOT NULL)', (err, rows) => {
  if (!err)
  {
    console.log("User table is created");
  } 
  else
  {
    throw err;
  }
});

connection.query('CREATE TABLE note(username VARCHAR(45) NOT NULL, title TEXT(100) NOT NULL, content LONGTEXT, category TEXT(100), date DATE)', (err, rows) => {
  if (!err)
  {
    console.log("Note table is created");
  } 
  else
  {
    throw err;
  }
});

*/

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started on Port 5000");
});

console.log("APP IS LISTENING ON PORT" + port);


//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemyql'
    db.query(sql, err => {
        if(err)
        {
            throw err
        }
        res.send('Database is created');
    })
});

app.get('/posts', (req, res) => {
    res.send('We are now in posts');
});
