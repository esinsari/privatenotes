const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcrypt'); // for hashing password

// const db or const connection
var connection = mysql.createConnection({
    host: process.env.pn_database_host,
    user: process.env.pn_database_user,
    password: process.env.pn_database_password,
    database: process.env.pn_database,
    port: process.env.pn_database_port
  });

global.user_name = "username";

exports.register = (req, res) => {
    console.log(req.body);

    /*
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    */
    // Destructuring 
    const{ username, password, passwordConfirm } = req.body;

    // Restricts new users to register with an existing username in database
    connection.query("SELECT username FROM user WHERE username = ?", [username], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('register', {
                message: 'Username is already in use'
            })
        }
        else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            })   
        }
        
        let hashedPassword = await bcrypt.hash(password, 2);
        console.log(hashedPassword);
   
        connection.query("INSERT INTO user set ?", {username: username, password: hashedPassword}, (error, results) => {
            if(error) {
                throw error;
            }
            else {
                return res.render('register', {
                    message: 'User registered'
                })  
            }
        });
    
    });
}

exports.login = async (req, res) => {
    console.log(req.body);

    try {
        const{ username, password } = req.body;

        if( !username || !password) {
            return res.status(400).render('login', {
                message: 'Please provide a username and password'
            })
        }

            // Restricts new users to register with an existing username in database
        connection.query("SELECT * FROM user WHERE username = ?", [username], async (error, results) => {
        
            console.log(results);

            // if there is no equivalent username/ incorrect password in database
            if(results.length == 0 || !(await bcrypt.compare(password, results[0].password)) ) {
                console.log('Incorrect username or password');

                res.render('login', {
                    message: 'Incorrect username or password'
                })
            }
            else {

                user_name = username;
                console.log('USERNAME IS: ' + user_name);

                const id = results[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);

                connection.query("SELECT * FROM note WHERE username = ?", [user_name], function (error, result, fields) {
                    if (error){
                       throw error;
                    } 
                    else {        
                        console.log(result);
                        res.render('home', {
                            userData: result,
                            userName: user_name
                        })
                    }
                });

                //redirect user to home page
               // res.status(200).redirect("/home");

            }
        });

    } catch (error) {
        console.log(error);
    }
    
    console.log(req.body);
}

exports.edit = (req, res) => {
    console.log(req.body);

    const{ username, passwordCurrent, password, passwordConfirm } = req.body;

    if( !username || !passwordCurrent || !password || !passwordConfirm ) {
        return res.status(400).render('edit', {
            message: 'Please provide a username and password'
        })
    }
    else if (password !== passwordConfirm) {
        return res.status(400).render('edit', {
            message: 'Passwords do not match'
        })   
    }

    connection.query("SELECT * FROM user WHERE username = ?", [username], async (error, results) => {
        
        console.log(results);

        // if there is no equivalent username/ incorrect password in database
        if(results.length == 0 || !(await bcrypt.compare(passwordCurrent, results[0].password)) ) {
            console.log('Incorrect username or password');

            res.render('login', {
                message: 'Incorrect username or password'
            })
        } 
        else {
           
            let hashedPassword = await bcrypt.hash(password, 2);
            console.log(hashedPassword);

            var sql = "UPDATE user SET password = ? WHERE username = ?"
            connection.query(sql, [hashedPassword, username], (error, results) => {
                if(error) {
                    throw error;
                }
                else {
                    return res.render('edit', {
                        message: 'Password is successfully changed'
                    })  
                }
            });
        }
    });
}

exports.note = (req, res) => {
    console.log(req.body);

    const{ username, title, category, date, content } = req.body;

    connection.query("SELECT title FROM note WHERE title = ?", [title], (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('note', {
                message: 'Note with same title is already exist'
            })
        }
        else if( !title ) {
            return res.status(400).render('note', {
                message: 'Note without title/content/date cannot be submitted'
            })
        }
    
        connection.query("INSERT INTO note set ?", {username: username, title: title, category: category, date: date, content: content}, (error, results) => {
            if(error) {
                throw error;
            }
            else {
                return res.render('note', {
                    message: 'New note created',
                    userName: username
                })  
            }
        });
    
    });
}

exports.display = (req, res) => {
    
    console.log(req.body);

    const{title} = req.body;

    connection.query("SELECT * FROM note WHERE title = ?", [title], function (error, result, fields) {
        if (error){
           throw error;
        } 
        else if (result.length == 0) {
            return res.render('display', {
                message: 'Entered title is not exist'
            })
        }
        else {        
            console.log(result);
            res.render('display', {
                userData: result,
                userName: result[0].username
            })
        }
    });
}

exports.delete = (req, res) => {
   
    console.log(req.body);

    const{ title } = req.body;
    
    connection.query("SELECT * FROM note WHERE title = ?", [title], function (error, result, fields) {
        if (error){
           throw error;
        } 
        else if (result.length == 0) {
            return res.render('note', {
                message: 'Entered title is not exist'
            })
        }
        else {        
            console.log(result);
            res.render('delete', {
                userData: result,
                userName: result[0].username
            })
        }
    });

    connection.query("DELETE FROM note WHERE title = ?", [title], function (error, result, fields) {
        if (error){
           throw error;
        } 
        else {        
            console.log("Note deleted");
        }
    });

}

exports.editnote = (req, res) => {
    
    console.log(req.body);

    const{search} = req.body;
    
    connection.query("SELECT * FROM note WHERE title = ?", [search], function (error, result, fields) {
        if (error){
           throw error;
        }
        else if (result.length == 0) {
            return res.render('note', {
                message: 'Entered title is not exist'
            })
        }
        else {        
            console.log(result);
            res.render('editnote', {
                userData: result,
                userName: result[0].username
            })
        }
    });
}

