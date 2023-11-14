const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    department: String,
    municipality: String,
    document_type: String,
    document: {
        type: String,
        unique: true,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(value) {
                // Expresión regular para validar que el correo sea de Gmail o Outlook
                return /.+@(gmail|outlook)\.(com)$/.test(value);
            },
            message: 'Por favor ingrese un correo válido (solo se permiten correos de Gmail o Outlook)'
        },
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    avatar: String,
    role: String,
    active: Boolean,
    verifyCode: String,
});

module.exports = mongoose.model("User",UserSchema);
