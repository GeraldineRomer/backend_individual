const { NODEMAILER_USER } = require('../constants');
const { NODEMAILER_PASSWORD } = require('../constants');
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (verifyCode) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASSWORD
            }
        });
        // send mail with defined transport object
        const email = await transporter.sendMail({
            from: '"Bienvenido" <booksandbooks@gmail.com>', // sender address
            to: NODEMAILER_USER, // list of receivers
            subject: "Bienvenido a Books&Books", // Subject line
            html: `Te has registrado en Books&Books, este es tu código de verificación: ${verifyCode}`, // html body
        });

        return email; // Retorna el objeto del correo electrónico enviado
    } catch (error) {
        throw new Error('Error al enviar el correo electrónico: ' + error);
    }
};

const emailChangePassword = async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASSWORD
            }
        });
        // send mail with defined transport object
        const email = await transporter.sendMail({
            from: '"Bienvenido" <booksandbooks@gmail.com>', // sender address
            to: NODEMAILER_USER, // list of receivers
            subject: "Cambio de contraseña", // Subject line
            html: `Para cambiar tu contraseña haz click <a href="http://localhost:3000/changepassword">aquí</a>`, // html body
        });
        return email; // Retorna el objeto del correo electrónico enviado
    } catch (error) {
        throw new Error('Error al enviar el correo electrónico: ' + error);
    }
};

module.exports = {
    sendVerificationEmail,
    emailChangePassword
};
