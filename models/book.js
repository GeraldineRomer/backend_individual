const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar el ID de la categoría
        ref: 'Category',
        require: true,
    },
    active: Boolean,
    status: {
        type: String,
        require: true,
    },
    images: [{ type: String }, { type: String }, { type: String }] 
});

module.exports = mongoose.model("Book",BookSchema);
