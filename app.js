// Importamos Express para crear el servidor
const express = require("express");
const app = express();

<<<<<<< HEAD
// Importamos las rutas de libros
const biblioRoutes = require("./routes/bilbioRoutes");
=======
// Importamos las rutas
const biblioRoutes = require("./routes/biblioRoutes");
const prestamoRoutes = require("./routes/prestamoRoutes");
>>>>>>> 84aa9a302556b5b2d5438a0200c1b859dbe633ab

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

<<<<<<< HEAD
// Definimos la ruta base para la API de Biblioteca
app.use("/apiV1/libros", biblioRoutes);
=======
// Definimos las rutas de la API
app.use("/apiV1/biblioteca", biblioRoutes);
app.use("/apiV1/prestamos", prestamoRoutes);
>>>>>>> 84aa9a302556b5b2d5438a0200c1b859dbe633ab

// Definimos el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor y mostramos un mensaje en la consola
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
