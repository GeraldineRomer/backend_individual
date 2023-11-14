const { MAILGUN_DOMAIN } = require('../constants');
const { MAILGUN_API_KEY } = require('../constants');

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

const email = (verifyCode) => {
    const messageData = {
        from: "BooksandBooks <booksandbooks@gmail.com>",
        to: "geraldine.rome0104@gmail.com",
        subject: 'Verificación',
        text: `Te has registrado en Books&Books, este es tu código de verificación: ${verifyCode}`
    };

    mg.messages.create(MAILGUN_DOMAIN, messageData)
        .then((res) => {
        console.log("respuesta dentro del emailer", res);
        })
        .catch((err) => {
        console.error("error dentro del emailer", err);
        console.error("Detalles del error:", err.details);
    });
};

module.exports = {
    email
};
