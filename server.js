const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let bookList = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    year: 1960,
    description: "A novel by Harper Lee",
    quantity: 10,
    imageURL: "http://localhost:3001/assets/to-kill-a-mockingbird.jpg",
  },
  {
    id: 2,
    title: "1984",
    year: 1949,
    description: "A novel by George Orwell",
    quantity: 5,
    imageURL: "http://localhost:3001/assets/1984.jpg",
  },
];

let nextId = 3;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/listBooks", (req, res) => {
  res.json(bookList);
});

app.post("/addBook", (req, res) => {
  const book = { id: nextId++, ...req.body };
  bookList.push(book);
  res.json(book);
});

app.put("/updateBook/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = bookList.findIndex((b) => b.id === id);
  if (bookIndex >= 0) {
    bookList[bookIndex] = { ...bookList[bookIndex], ...req.body };
    res.json(bookList[bookIndex]);
  } else {
    res.status(404).send();
  }
});

app.delete("/deleteBook/:id", (req, res) => {
  const id = parseInt(req.params.id);
  bookList = bookList.filter((b) => b.id !== id);
  res.json(id);
});

app.listen(3001, () => console.log("Server listening on port 3001"));
