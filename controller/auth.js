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
   
        // LATER CHANGE PASSWORD TO HASSPASSWORD
        connection.query("INSERT INTO user set ?", {username: username, password: password}, (error, results) => {
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
            // LATER add to bcrypt.compare(password, results[0].password)
            if(!results) {
                res.status(400).render('login', {
                    message: 'Incorrect username or password'
                })
            }    
            else {
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

                //redirect user to home page
                res.status(200).redirect("/home");

            }
        });

    } catch (error) {
        console.log(error);
    }
    
    console.log(req.body);
}

exports.edit = (req, res) => {
    console.log(req.body);

    const{ username, password, passwordConfirm } = req.body;

    if( !username || !password || !passwordConfirm ) {
        return res.status(400).render('edit', {
            message: 'Please provide a username and password'
        })
    }
    else if (password !== passwordConfirm) {
        return res.status(400).render('edit', {
            message: 'Passwords do not match'
        })   
    }

    connection.query("UPDATE user SET password = 'password' WHERE username = 'username'", {username: username, password: password}, (error, results) => {
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

exports.note = (req, res) => {
    console.log(req.body);

    const{ username, title, category, date, content } = req.body;

    // Restricts new users to register with an existing username in database
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
    
 
        // LATER CHANGE PASSWORD TO HASSPASSWORD
        connection.query("INSERT INTO note set ?", {username: username, title: title, category: category, date: date, content: content}, (error, results) => {
            if(error) {
                throw error;
            }
            else {
                return res.render('note', {
                    message: 'New note created'
                })  
            }
        });
    
    });
}

exports.home = (req, res) => {
    
    console.log(req.body);
    

    connection.query("SELECT * FROM note", function (error, result, fields) {
        if (error){
           throw error;
        } 
        else {        
            console.log(result);
            res.render('home', {
                userData: result
            })
        }
    });

}

exports.category = (req, res) => {
    
    console.log(req.body);
    

    connection.query("SELECT * FROM note", function (error, result, fields) {
        if (error){
           throw error;
        } 
        else {        
            console.log(result);
            res.render('category', {
                userData: result
            })
        }
    });

}

exports.date = (req, res) => {
    
    console.log(req.body);
    

    connection.query("SELECT * FROM note", function (error, result, fields) {
        if (error){
           throw error;
        } 
        else {        
            console.log(result);
            res.render('date', {
                userData: result
            })
        }
    });

}

exports.display = (req, res) => {
   
    console.log(req.body);

    const{ title } = req.body;
    
    connection.query("SELECT * FROM note WHERE title = ?", [title], function (error, result, fields) {
        if (error){
           throw error;
        } 
        else {        
            console.log(result);
            res.render('display', {
                userData: result
            })
        }
    });
}

exports.editnote = (req, res) => {
   
    console.log(req.body);

    const{ title } = req.body;
    
    connection.query("SELECT * FROM note WHERE title = ?", [title], function (error, result, fields) {
        if (error){
           throw error;
        } 
        else {        
            console.log(result);
            res.render('editnote', {
                userData: result
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
        else {        
            console.log(result);
            res.render('delete', {
                userData: result
            })
        }
    });
}
