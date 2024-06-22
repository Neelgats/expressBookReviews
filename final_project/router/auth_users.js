const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let valid = users.filter((user) => user.userName === username);
  if (valid.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.

  let valid = users.filter((user) => {
    return user.userName === username && user.password === password;
  });
  if (valid.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (isValid(userName)) {
    if (authenticatedUser(userName, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      req.session.authorization = {
        accessToken,
        userName,
      };
      return res.status(200).send(`User ${userName} successfully logged in!`);
    }
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const review=req.query.review;
  const username=req.body.userName;

  // if(!books[isbn]){
  //   return res.status(404).send("Book not found");
  // }
  if(!review){
    return res.status(400).send("No reviews yet");
  }
  if(!username){
    return res.status(401).send("User not authenticated");
  }
  books[isbn].reviews[username]=review;
  res.send(`Review for book with ISBN ${isbn} has been added!`);
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const username=req.session.userName;
  const isbn=req.body.isbn;
  if(username){
    delete books[isbn].reviews[username];
  }
  res.send(`the review for book with ISBN ${isbn} by ${username} is deleted!`);


})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
