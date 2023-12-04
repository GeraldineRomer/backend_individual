const express = require('express');
const api = express.Router();
const bookController = require('../controllers/book');
const md_auth = require("../middlewares/authenticated");
const md_upload = require("../controllers/upload")

// Rutas para libros
api.get('/books', md_upload.upload,bookController.getBooks);
api.get('/books/:book_id', [md_auth.ensureAuth] , md_upload.upload,bookController.getBook);
api.post('/book', [md_auth.ensureAuth], md_upload.upload, bookController.createBook);
api.patch('/books/:id', [md_auth.ensureAuth] ,bookController.updateBook);
api.delete('/books/:id', [md_auth.ensureAuth] ,bookController.deleteBook);
api.get('/bookscomplete', bookController.getBooksComplete);

module.exports = api;
