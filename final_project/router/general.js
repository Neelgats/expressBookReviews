const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExist = (userName) => {
  let exist = users.filter((user) => {
    return user.userName === userName;
  });
  if (exist.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  if (userName && password) {
    if (isValid(userName)) {
      users.push({ userName: userName, password: password });
      res.send(`user ${userName} registered`);
    } else {
      res.send("already an user exists");
    }
  } else {
    res.send("no username and password");
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  Promise.resolve(books)
    .then((books) => {
      res.send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      res.status(500).send("An error occurred while retrieving the books.");
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.body.isbn;
  Promise.resolve(books[isbn] || null)
    .then((book) => {
      if (book) {
        res.send(books[isbn]);
      } else {
        res.status(404).send("Book not found");
      }
    })
    .catch((error) => {
      res.status(500).send("An error occurred");
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorName = req.body.author;
  new Promise((resolve, reject) => {
    let found = [];
    for (let key in books) {
      if (books[key].author === authorName) {
        found.push(books[key]);
      }
    }
    resolve(found);
  })
    .then((found) => {
      if (found.length > 0) {
        res.send(found);
      } else {
        res.send("no books found");
      }
    })
    .catch((error) => {
      res.status(500).send("An error occurred");
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.body.title;
  new Promise((resolve, reject) => {
    let found = [];
    for (let key in books) {
      if (books[key].title === title) {
        found.push(books[key]);
      }
    }
    resolve(found);
  })
    .then((found) => {
      if (found.length > 0) {
        res.send(found);
      } else {
        res.status(404).send("no books found");
      }
    })
    .catch((error) => {
      res.status(500).send("An error occurred");
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.body.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
