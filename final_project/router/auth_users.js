const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {
  "thara": { password: "secure123" }
};

// Check if username exists
const isValid = (username) => { 
  return users.hasOwnProperty(username);
}

// Check if username/password match
const authenticatedUser = (username, password) => { 
  if (isValid(username)) {
    return users[username].password === password;
  }
  return false;
}


regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).send(JSON.stringify({ message: "Username and password are required." }));
    }
  
    // Validate user
    if (!isValid(username)) {
      return res.status(404).send(JSON.stringify({ message: "User not found." }));
    }
  
    if (users[username].password !== password) {
      return res.status(401).send(JSON.stringify({ message: "Invalid password." }));
    }
  
    const accessToken = jwt.sign(
      { username },
      "access", // secret key
      { expiresIn: '1h' }
    );
  
    // Save token in session
    req.session.authorization = {
      accessToken,
      username
    };
  
    return res.status(200).send(JSON.stringify({ 
      message: "Login successful", 
      token: accessToken 
    }, null, 2));
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
