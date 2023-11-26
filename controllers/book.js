const Book = require("../models/book");

async function createBook(req, res) {
    try {
        const { title, author, description, categoryId, status, images } = req.body;

        // Verificar si la categoría existe antes de crear el libro
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({ msg: "La categoría especificada no existe" });
        }

        // Crear un nuevo documento de Book con los datos proporcionados
        const book = new Book({
            title,
            author,
            description,
            category: categoryId, // Asignar la categoría al libro usando el ID de la categoría
            status,
            images, // Aquí se pueden pasar las URLs de las imágenes
            active: false, // Si se requiere que el libro se cree como inactivo por defecto
        });

        // Guardar el libro en la base de datos
        const bookStored = await book.save();

        res.status(201).send(bookStored);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el libro", error: error.message });
    }
}


async function getBooks(req, res) {
    const { active, category, page = 1, limit = 5 } = req.query;

    try {
        let query = {};

        if (active !== undefined) {
            query.active = active;
        }

        if (category) {
            query.category = category; // Filtrar por categoría si se proporciona
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < (await Book.countDocuments(query).exec())) {
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

        const response = await Book.find(query).limit(limit).skip(startIndex).populate('category').exec();
        results.results = response;

        res.status(200).send({ results: results.results, next: results.next });

    } catch (error) {
        res.status(500).send({ message: "Error al obtener libros", error: error.message });
    }
}



async function getBooksComplete(req, res) {
    const { active } = req.query;
    let response = null;

    try {
        if (active === undefined) {
            response = await Book.find().populate('category');
        } else {
            const activeCategories = await Category.find({ active });
            const activeCategoryIds = activeCategories.map(category => category._id);
            response = await Book.find({ category: { $in: activeCategoryIds } }).populate('category');
        }

        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener libros", error: error.message });
    }
}


async function getBook(req, res) {
    const { book_id } = req.params;

    const response = await Book.findById(book_id);

    if (!response) {
        res.status(404).send({ msg: "No se ha encontrado el libro" });
    } else {
        res.status(200).send(response);
    }
}

async function updateBook(req, res) {
    try {
        const { id } = req.params;
        const bookData = req.body;

        // Actualizar el libro con los datos proporcionados
        await Book.findByIdAndUpdate(id, bookData);

        res.status(200).send({ msg: "Actualización correcta" });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el libro", error: error.message });
    }
}


async function deleteBook(req, res) {
    try {
        const { id } = req.params;
        await Book.findByIdAndDelete(id);
        res.status(200).send({ msg: "Libro eliminado" });
    } catch (error) {
        res.status(400).send({ msg: "Error al eliminar el libro", error: error.message });
    }
}


module.exports = {
    getBook,
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    getBooksComplete
};
