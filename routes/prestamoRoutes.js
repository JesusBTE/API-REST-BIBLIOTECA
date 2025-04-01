const express = require("express");
const PrestamoController = require("../controllers/prestamoController");

const router = express.Router();

// Obtener todos los préstamos
router.get("/", PrestamoController.getPrestamos);

// Obtener un préstamo por ID
router.get("/:id", PrestamoController.getPrestamoById);

// Crear un nuevo préstamo
router.post("/", PrestamoController.createPrestamo);

// Finalizar un préstamo (marcar como devuelto)
router.put("/:prestamoId/devolver", PrestamoController.finalizarPrestamo);

// Actualizar un préstamo
router.put("/:id", PrestamoController.updatePrestamo);

// Eliminar un préstamo
router.delete("/:id", PrestamoController.deletePrestamo);

module.exports = router;