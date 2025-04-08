const express = require("express");
const router = express.Router();
const autorController = require("../controllers/autorController");

router.get("/", autorController.getAutores);
router.post("/", autorController.createAutor);
// Agrega esta ruta al final del archivo
router.get("/:autorId/libros", autorController.getLibrosByAutor);
module.exports = router;