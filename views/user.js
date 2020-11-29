const mysql = require('mysql');

/*
//to create table
connection.query('CREATE TABLE user(username VARCHAR(45) NOT NULL, password VARCHAR(100) NOT NULL)', (err, rows) => {
  if (!err)
  {
    console.log("User table is created");
  } 
  else
  {
    throw err;
  }
});


connection.query('CREATE TABLE note(username VARCHAR(45) NULL, title TEXT(100) NOT NULL, content LONGTEXT NULL, category TEXT(100) NULL, date DATE NULL)', (err, rows) => {
  if (!err)
  {
    console.log("Note table is created");
  } 
  else
  {
    throw err;
  }
});

connection.query('DROP TABLE user', (err, rows) => {
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