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

app.post('/search', function(req, res) {
   
  console.log(req.body);

  const{ username, title, category, date, content } = req.body;
  
  var sql = "UPDATE note SET username = ?, title = ?, category = ?, date = ?, content = ? WHERE title = ?";
      
  connection.query(sql, [username, title, category, date, content, title], (error, results) => {
      if(error) {
          throw error;
          return res.status(400).render('editnote', {
            message: 'Please enter correct format for inputs'
        })
      }
      else if( !title ) {
        return res.status(400).render('editnote', {
            message: 'Note without title/content/date cannot be submitted'
        })
      }
      else{
         // res.redirect('/home');
          res.render('editnote', {
            userName: username
        })
      }
      
  });

});

app.post('/home', function(req, res) {
    
  console.log(req.body);  
 
  const{ username } = req.body;

  console.log(username);

  connection.query("SELECT * FROM note WHERE username = ?", [username], function (error, result, fields) {
      if (error){
         throw error;
      } 
      else {        
          console.log(result);
          res.render('home', {
              userData: result,
              userName: username
          })
      }
  });

});

app.post('/category', function(req, res) {
  
  console.log(req.body);

  const{ username } = req.body;

  console.log(username);


  connection.query("SELECT * FROM note WHERE username = ?", [username], function (error, result, fields) {
      if (error){
         throw error;
      } 
      else {        
          console.log(result);
          res.render('category', {
              userData: result,
              userName: username
          })
      }
  });

});

app.post('/date', function(req, res) {
  
  console.log(req.body);

  const{ username } = req.body;

  console.log(username);

  connection.query("SELECT * FROM note WHERE username = ?", [username], function (error, result, fields) {
      if (error){
         throw error;
      } 
      else {        
          console.log(result);
          res.render('date', {
              userData: result,
              userName: username
          })
      }
  });

});


app.get('/posts', (req, res) => {
    res.send('We are now in posts');
});
