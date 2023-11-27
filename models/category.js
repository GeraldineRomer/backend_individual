const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    active: {
        type: Boolean,
        require: true,
    }
});

module.exports = mongoose.model("Category",CategorySchema);
