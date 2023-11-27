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
    price: {
        type: Number,
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
    status: {
        type: Boolean,
        require: true,
    },
    images: [{ type: String }, { type: String }, { type: String }] 
});

module.exports = mongoose.model("Book",BookSchema);
