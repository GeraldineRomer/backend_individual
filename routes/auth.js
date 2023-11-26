const express = require("express");
const AuthController = require("../controllers/auth");

const api = express.Router();

api.post("/register", AuthController.register);
api.post("/auth/login", AuthController.login);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);
api.post("/auth/verifycode", AuthController.verifyCode);
api.post("/auth/changepassword", AuthController.emailChange);
api.post("/auth/verifypassword", AuthController.verifyPassword);

module.exports = api;
