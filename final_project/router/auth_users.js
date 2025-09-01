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

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(" ")[1]; // "Bearer <token>"
      jwt.verify(token, "access", (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user; // e.g. { username: "thara", iat:..., exp:... }
        next();
      });
    } else {
      res.status(401).json({ message: "Authorization header missing" });
    }
  };
  
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
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res
  .status(200)
  .send(JSON.stringify({
    message: "Review successfully added/updated",
    book: { isbn, reviews: books[isbn].reviews }
  }, null, 2));
  });
// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 2));
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).send(JSON.stringify({ message: "No review found for this user" }, null, 2));
    }
  
    // Delete only the logged-in user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).send(JSON.stringify({
      message: "Review successfully deleted",
      book: { isbn, reviews: books[isbn].reviews }
    }, null, 2));
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
