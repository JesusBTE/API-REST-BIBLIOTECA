
// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos el controlador de user
const userController = require("../controllers/userController");

// Definimos las ruta para gestionar los usuarios

// Crear un usuario
router.post("/", userController.createUser);


// Exportamos el router para que este pueda ser utilizado en la aplicación principal
module.exports = router;
