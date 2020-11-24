const mysql = require('mysql');

//to create table
//connection.query('CREATE TABLE user(username VARCHAR(45) NOT NULL, password INT NOT NULL)', (err, rows) => {
// if (!err)
//  {
//    console.log("User table is created");
//  } 
//  else
//  {
//    throw err;
//  }
//});

//connection.query('CREATE TABLE note(username VARCHAR(45) NOT NULL, title TEXT(100) NOT NULL, content LONGTEXT, category TEXT(100), date DATE)', (err, rows) => {
//  if (!err)
//  {
//    console.log("Note table is created");
//  } 
//  else
//  {
//    throw err;
//  }
//});