// Importamos Express para crear el servidor
const express = require("express");
const app = express();

// Importamos las rutas
const biblioRoutes = require("./routes/biblioRoutes");
const prestamoRoutes = require("./routes/prestamoRoutes");

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Definimos las rutas de la API
app.use("/apiV1/libros", biblioRoutes);
app.use("/apiV1/prestamos", prestamoRoutes);

// Definimos el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor y mostramos un mensaje en la consola
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
