const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    active: {
        type: boolean,
        require: true,
    }
});

module.exports = mongoose.model("Category",CategorySchema);
