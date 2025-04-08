// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos el controlador de biblioteca
const bookController = require("../controllers/bookController");

// Definimos las rutas para gestionar todos los libros

// Obtener todas los libros

// Crear un libro
router.post("/", bookController.createBook);

// Obtener un libro por su ID
router.get("/", bookController.getBooks);

// Obtener un libro por su ID
router.get("/:id", bookController.getBookById);

// Actualizar un libro por su ID
router.put("/:id", bookController.updateBook);

// Eliminar un libro por su ID
router.delete("/:id", bookController.deleteBook);

// Agrega estas rutas al final del archivo
router.get("/search/s", bookController.searchBooks);
router.get("/:libroId/disponibilidad", bookController.checkAvailability);

// Exportamos el router para que este pueda ser utilizado en la aplicación principal
module.exports = router;
