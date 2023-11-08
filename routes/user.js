const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({ uploadDir: "../Upload/userAvatar"});
const api = express.Router();

api.post("/user", [md_auth.ensureAuth] , UserController.createUser);
api.get("/user/me", [md_auth.ensureAuth], UserController.getMe);
api.get("/users", UserController.getUsers);
api.patch("/user/:id", [md_auth.ensureAuth, md_upload] , UserController.updateUser);
api.delete("/user/:id", [md_auth.ensureAuth] , UserController.deleteUser);

module.exports = api;
