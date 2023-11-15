const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
    try {
        const { password } = req.body;
        const user = new User({ ...req.body, active: false });
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        user.password = hashPassword;
        if (req.avatar) {
            user.avatar = req.avatar;
        }
        const userStored = await user.save();
        res.status(201).send(userStored);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el usuario", error: error.message });
    }
}

async function getUsers(req, res) {
    const { active } = req.query;
    let response = null;

    if (active === undefined) {
        response = await User.find();
    } else {
        response = await User.find({ active });
    }
    res.status(200).send(response);
}

async function getMe(req, res) {
    const { user_id } = req.user;

    const response = await User.findById(user_id);

    if (!response) {
        res.status(404).send({ msg: "No se ha encontrado usuario" });
    } else {
        res.status(200).send(response);
    } 
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const userData = req.body;
        if (userData.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(userData.password, salt);
            userData.password = hashPassword;
        } else {
            delete userData.password;
        }
        if (req.avatar) {
            userData.avatar = req.avatar;
        }
        await User.findByIdAndUpdate({ _id: id }, userData);
        res.status(200).send({ msg: "Actualizacion correcta" });
        } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el usuario", error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).send({ msg: "Usuario eliminado" });
    } catch (error) {
        res.status(400).send({ msg: "Error al eliminar el usuario", error: error.message });
    }
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
