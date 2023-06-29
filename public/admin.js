async function main() {
  const bookList = await getBookList();
  renderBookList(bookList);
  bindAddBookForm();
}

async function getBookList() {
  const response = await fetch("http://localhost:3001/listBooks");
  const books = await response.json();
  return books;
}

function renderBookList(books) {
  const rootElement = document.getElementById("root");
  let bookListHtml = `<table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Year</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Image URL</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;

  books.forEach((book) => {
    bookListHtml += `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.year}</td>
                <td>${book.description}</td>
                <td>${book.quantity}</td>
                <td>${book.imageURL}</td>
                <td>
                    <button class="btn btn-primary btn-edit" data-id="${book.id}">Edit</button>
                    <button class="btn btn-danger btn-delete" data-id="${book.id}">Delete</button>
                </td>
            </tr>
        `;
  });

  bookListHtml += `</tbody></table>`;

  bookListHtml += `
        <h2>Add a Book</h2>
        <form id="add-book-form">
            <label for="title">Title: </label><input type="text" id="title" required/><br/>
            <label for="year">Year: </label><input type="number" id="year"/><br/>
            <label for="description">Description: </label><input type="text" id="description" required/><br/>
            <label for="quantity">Quantity: </label><input type="number" id="quantity" required/><br/>
            <label for="imageURL">Image URL: </label><input type="text" id="imageURL"/><br/>
            <button type="submit" class="btn btn-success">Add Book</button>
        </form>
    `;

  rootElement.innerHTML = bookListHtml;

  bindEditAndDeleteButtons();
}

function bindEditAndDeleteButtons() {
  const editButtons = document.getElementsByClassName("btn-edit");
  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      editBook(id);
    });
  }

  const deleteButtons = document.getElementsByClassName("btn-delete");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      deleteBook(id);
    });
  }
}

async function editBook(id) {
  const response = await fetch(`http://localhost:3001/listBooks`);
  const books = await response.json();
  const book = books.find((b) => b.id == id);

  if (book) {
    let formHtml = `
            <h2>Edit Book</h2>
            <form id="edit-book-form">
                <input type="hidden" id="id" value="${book.id}"/>
                <label for="title">Title: </label><input type="text" id="title" value="${book.title}" required/><br/>
                <label for="year">Year: </label><input type="number" id="year" value="${book.year}"/><br/>
                <label for="description">Description: </label><input type="text" id="description" value="${book.description}" required/><br/>
                <label for="quantity">Quantity: </label><input type="number" id="quantity" value="${book.quantity}" required/><br/>
                <label for="imageURL">Image URL: </label><input type="text" id="imageURL" value="${book.imageURL}"/><br/>
                <button type="submit" class="btn btn-success">Update Book</button>
            </form>
        `;
    document.getElementById("root").innerHTML += formHtml;

    bindEditBookForm();
  }
}

async function deleteBook(id) {
  await fetch(`http://localhost:3001/deleteBook/${id}`, {
    method: "DELETE",
  });

  main();
}

function bindAddBookForm() {
  document
    .getElementById("add-book-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const book = {
        title: document.getElementById("title").value,
        year: document.getElementById("year").value,
        description: document.getElementById("description").value,
        quantity: document.getElementById("quantity").value,
        imageURL: document.getElementById("imageURL").value,
      };

      await fetch("http://localhost:3001/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      main();
    });
}

function bindEditBookForm() {
  document
    .getElementById("edit-book-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const book = {
        id: document.getElementById("id").value,
        title: document.getElementById("title").value,
        year: document.getElementById("year").value,
        description: document.getElementById("description").value,
        quantity: document.getElementById("quantity").value,
        imageURL: document.getElementById("imageURL").value,
      };

      await fetch(`http://localhost:3001/updateBook/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      main();
    });
}

main();
