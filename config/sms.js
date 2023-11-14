const { TWILIO_ACCOUNT_SID } = require("../constants");
const { TWILIO_AUTH_TOKEN } = require("../constants");

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sms= (verifyCode) =>{
    client.messages
        .create({
            body: `Te has registrado en Books&Books, este es tu código de verificación: ${verifyCode}`,
            from: '+12054985117',
            to: '+573233531145'
        })
        .then(message => console.log('SMS enviado -> ', message.sid))
        .catch(err => {
            console.log('Hay un error al enviar el sms -> ', err);
        });
}

module.exports={
    sms
}
