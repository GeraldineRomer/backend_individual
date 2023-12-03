const express = require('express');
const api = express.Router();
const categoryController = require('../controllers/category');
const md_auth = require("../middlewares/authenticated");
// Rutas para categorías
api.get('/categories', [md_auth.ensureAuth] ,categoryController.getCategories);
api.get('/categories/all', [md_auth.ensureAuth] ,categoryController.getAllCategories);
api.get('/categories/:category_id', [md_auth.ensureAuth] , categoryController.getCategory);
api.post('/category', [md_auth.ensureAuth] , categoryController.createCategory);
api.patch('/categories/:id', [md_auth.ensureAuth] ,categoryController.updateCategory);
api.delete('/categories/:id', [md_auth.ensureAuth] , categoryController.deleteCategory);

module.exports = api;
