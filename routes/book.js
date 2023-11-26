const express = require('express');
const api = express.Router();
const bookController = require('../controllers/book');
const md_auth = require("../middlewares/authenticated");

// Rutas para libros
api.get('/books', [md_auth.ensureAuth] ,bookController.getBooks);
api.get('/books/:book_id', [md_auth.ensureAuth] ,bookController.getBook);
api.post('/books', [md_auth.ensureAuth] ,bookController.createBook);
api.put('/books/:id', [md_auth.ensureAuth] ,bookController.updateBook);
api.delete('/books/:id', [md_auth.ensureAuth] ,bookController.deleteBook);
api.get('/books/complete', [md_auth.ensureAuth] ,bookController.getBooksComplete);

module.exports = api;
