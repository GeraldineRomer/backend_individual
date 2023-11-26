const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    fullanme: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    books: {
        type: String,
        require: true,
    },
    image: String,
});

module.exports = mongoose.model("Author",AuthorSchema);
