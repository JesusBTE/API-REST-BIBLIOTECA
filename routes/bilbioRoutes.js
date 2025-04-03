// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos el controlador de biblioteca
const biblioController = require("../controllers/biblioController");

// Definimos las rutas para gestionar todos los libros

// Obtener todas los libros

// Crear un libro
router.post("/", biblioController.createBook);

// Obtener un libro por su ID
router.get("/", biblioController.getBooks);

// Obtener un libro por su ID
router.get("/:id", biblioController.getBookById);

// Actualizar un libro por su ID
router.put("/:id", biblioController.updateBook);

// Eliminar un libro por su ID
router.delete("/:id", biblioController.deleteBook);

// Exportamos el router para que pueda ser utilizado en la aplicación principal
module.exports = router;
