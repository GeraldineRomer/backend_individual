const Category = require("../models/category");

async function createCategory(req, res) {
    console.log("Entre en createCategory del back ");
    try {
        const { name, active } = req.body;
        console.log("name en back de createCategory -> ", name);
        console.log("active en back de createCategory -> ", active);
        // Crear un nuevo documento de Category con los datos proporcionados
        const category = new Category({
            name,
            active,
        });

        // Guardar la categoría en la base de datos
        const categoryStored = await category.save();

        res.status(201).send(categoryStored);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear la categoría", error: error.message });
    }
}

async function getCategories(req, res) {
    const { active, page = 1, limit = 5 } = req.query;

    try {
        let query = {};

        if (active !== undefined) {
            query.active = active;
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < (await Category.countDocuments(query).exec())) {
            results.next = {
                page: parseInt(page) + 1,
                limit: parseInt(limit)
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: parseInt(page) - 1,
                limit: parseInt(limit)
            };
        }

        const response = await Category.find(query).limit(limit).skip(startIndex).exec();
        results.results = response;

        res.status(200).send({ results: results.results, next: results.next });

    } catch (error) {
        res.status(500).send({ message: "Error al obtener categorías", error: error.message });
    }
}

async function getAllCategories(req, res) {
    try {
        const categories = await Category.find();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener todas las categorías", error: error.message });
    }
}

async function getCategory(req, res) {
    const { category_id } = req.params;

    try {
        const category = await Category.findById(category_id);

        if (!category) {
            res.status(404).send({ msg: "No se ha encontrado la categoría" });
        } else {
            res.status(200).send(category);
        }
    } catch (error) {
        res.status(500).send({ message: "Error al obtener la categoría", error: error.message });
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const categoryData = req.body;

        // Actualizar la categoría con los datos proporcionados
        await Category.findByIdAndUpdate(id, categoryData);

        res.status(200).send({ msg: "Actualización correcta" });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la categoría", error: error.message });
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).send({ msg: "Categoría eliminada" });
    } catch (error) {
        res.status(400).send({ msg: "Error al eliminar la categoría", error: error.message });
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
};
