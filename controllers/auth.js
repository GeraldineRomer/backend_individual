const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const smsmailer = require("../config/sms");
const emailer = require("../config/email");

//registro de un usuario nuevo en el sistema
const register = async (req, res) => {
    const { 
            firstname, 
            lastname, 
            email, 
            password, 
            country, 
            department, 
            municipality, 
            document_type, 
            document
        } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es requerido "});
    if (!password) return res.status(400).send({ msg: "La contraseña es requerida "});
    if (!document) return res.status(400).send({ msg: "El documento es requerida "});

        console.log('Llegue antes de verifycode');

    const generateRandomCode = () => Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const verifyCode = generateRandomCode();

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    //const hashPassword = await bcrypt.hash(password,salt);

    const user = new User({
        firstname,
        lastname,
        country,
        department,
        municipality,
        document_type,
        document,
        email: email.toLowerCase(),
        password: hashPassword,
        role: "guess",
        active: false,
        verifyCode
    });

    try {
        const userStorage = await user.save();
        res.status(201).send(userStorage);
        
        smsmailer.sms(verifyCode);
        emailer.sendVerificationEmail(verifyCode);
    } catch (error) {
        console.log("error al crear " + error);
        res.status(400).send({ msg: "Error al crear el usuario" + error});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!password) {
            throw new Error("la contraseña es obligatoria");
        }
        if(!email){
            throw new Error("El email es obligatorio");
        }
        const emailLowerCase = email.toLowerCase();
        const userStore = await User.findOne({ email: emailLowerCase }).exec();
        if (!userStore){
            throw new Error("El usuario no existe");
        }
        const check = await bcrypt.compare(password, userStore.password);
        if (!check){
            throw new Error("Contraseña incorrecta");
        }
        if (!userStore.active){
            throw new Error("Usuario no autorizado o no activo");
        }
        res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
        })
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
};

async function refreshAccessToken(req, res){
    const {token} = req.body;
    if (!token){
        return res.status(401).send({ msg: "Token requerido"});
    }
    try {
        const { user_id } = jwt.decoded(token);
        const userStorage = await User.findOne({_id: user_id});
        if (!userStorage) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }
        const accessToken = jwt.createAccessToken(userStorage);
        return res.status(200).send({ accessToken });
    } catch (error) {
        console.error("Error del servidor: ", error);
        return res.status(500).send({ msg: "Error del servidor "});
    }
};

const verifyCode = async (req, res) => {
    const { verificationCode } = req.body;
    console.log("code en el back - " + verificationCode);
    try {
        // Encuentra al usuario por el código de verificación
        const user = await User.findOne({ verifyCode: verificationCode });
        console.log("user -> " + user);

        if (!user) {
            return res.status(404).send({ msg: "Código de verificación incorrecto" });
        }

        // Si el código es correcto, actualiza el estado del usuario a activo
        await User.updateOne({ verifyCode: verificationCode }, { $set: { active: true } });

        return res.status(200).send({ success: true, msg: "Cuenta verificada con éxito" });
    } catch (error) {
        console.error("Error al verificar el código: ", error);
        return res.status(500).send({ msg: "Error al verificar el código" });
    }
};

const emailChange = async (req, res) => {
    try {
        emailer.emailChangePassword();
        res.status(200).send({ success: true, msg: "Mensaje enviado con éxito" });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).send({ error: 'Error al enviar el correo electrónico' });
    }
};

const verifyPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        //obtengo el usuario y luego su contraseña de la base de datos
        console.log("user id verifyPassword -> ", userId);
        console.log("new password verifyPassword -> ", newPassword);
        const user = await User.findById(userId); 
        const currentPassword = user.password //viene hasheada de la base de datos
        
        // Comparar la contraseña proporcionada por el usuario con el hash almacenado en la base de datos
        const isMatch = bcrypt.compareSync(newPassword, currentPassword);

        if (!isMatch) {
            return res.status(401).send({ message: 'La contraseña actual no coincide' });
        }

        // La contraseña actual coincide, puedes devolver un mensaje de éxito o lo que necesites
        return res.status(200).send({ message: 'La contraseña actual coincide' });
    } catch (error) {
        console.error('Error al verificar la contraseña actual:', error);
        return res.status(500).send({ error: 'Error al verificar la contraseña actual' });
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    verifyCode,
    emailChange,
    verifyPassword
};
