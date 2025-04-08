// Importamos el modelo Prestamo para interactuar con la base de datos
const Prestamo = require("../models/prestamo");
const admin = require("firebase-admin");
const db = admin.firestore(); // Inicializamos la instancia de Firestore

class PrestamoController {
  // Método para obtener todos los préstamos
  static async getPrestamos(req, res) {
    try {
      const prestamos = await Prestamo.getAllPrestamos(); // Llama al modelo para obtener todos los préstamos desde la base de datos
      res.json(prestamos); // Devuelve la lista de préstamos en formato JSON
    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores internos del servidor
    }
  }

  // Método para obtener un préstamo específico por su ID
  static async getPrestamoById(req, res) {
    try {
      const prestamo = await Prestamo.getPrestamoById(req.params.id); // Busca el préstamo en la base de datos usando el ID proporcionado en la URL
      res.json(prestamo); // Si se encuentra, devuelve el préstamo
    } catch (error) {
      res.status(404).json({ error: "Préstamo no encontrado" }); // Devuelve error si no se encuentra el préstamo
    }
  }

  // Método para crear un nuevo préstamo
  static async createPrestamo(req, res) {
    try {
      // Extraemos los campos necesarios del cuerpo de la solicitud
      const { libroId, usuarioId, fechaInicio, fechaFin, devuelto } = req.body;

      // Estructura de datos que se guardará en la base de datos
      const prestamoData = {
        libroId,
        usuarioId,
        fechaInicio,
        fechaFin,
        devuelto: String(devuelto) === "true" // Convertimos el valor recibido a booleano real
      };

      // Validar que todos los campos requeridos estén presentes
      if (!libroId || !usuarioId || !fechaInicio || !fechaFin || devuelto === undefined) {
        return res.status(400).json({ error: "Datos inválidos" }); // Devuelve error si faltan datos
      }

      // Verificamos que el libro exista en la base de datos
      const libroRef = db.collection("libros").doc(libroId);
      const libroSnapshot = await libroRef.get();

      if (!libroSnapshot.exists) {
        return res.status(404).json({ error: "El libro no existe" }); // Devuelve error si el libro no se encuentra
      }

      // Verificamos que el usuario exista en la base de datos
      const usuarioRef = db.collection("usuarios").doc(usuarioId);
      const usuarioSnapshot = await usuarioRef.get();

      if (!usuarioSnapshot.exists) {
        return res.status(404).json({ error: "El usuario no existe" }); // Devuelve error si el usuario no se encuentra
      }

      // Verificamos si el libro ya está prestado y aún no ha sido devuelto
      const prestamosRef = db.collection("prestamos");
      const prestamosSnapshot = await prestamosRef
        .where("libroId", "==", libroId)
        .where("devuelto", "==", false)
        .get();

      if (!prestamosSnapshot.empty) {
        return res.status(409).json({ error: "Libro no está disponible" }); // El libro ya está prestado
      }

      // Si todo es válido, creamos el préstamo usando el modelo
      const newPrestamo = await Prestamo.createPrestamo(prestamoData);

      // Enviamos respuesta de éxito junto con el préstamo creado
      res.status(201).json({
        message: "Préstamo realizado correctamente.",
        prestamo: newPrestamo
      });

    } catch (error) {
      // Error interno del servidor
      res.status(500).json({ error: error.message });
    }
  }

  // Método para actualizar un préstamo existente
  static async updatePrestamo(req, res) {
    try {
      // Actualiza el préstamo usando los datos del cuerpo de la solicitud
      await Prestamo.updatePrestamo(req.params.id, req.body);
      res.json({ message: "Préstamo actualizado correctamente" }); // Respuesta de éxito
    } catch (error) {
      res.status(500).json({ error: error.message }); // Error interno del servidor
    }
  }

  // Método para finalizar (marcar como devuelto) un préstamo
  static async finalizarPrestamo(req, res) {
    try {
      // Busca el préstamo por ID
      const prestamo = await Prestamo.getPrestamoById(req.params.prestamoId);

      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" }); // No existe el préstamo
      }

      if (prestamo.devuelto) {
        return res.status(409).json({ error: "Préstamo ya finalizado" }); // Ya ha sido devuelto
      }

      // Marca el préstamo como devuelto
      await Prestamo.updatePrestamo(req.params.prestamoId, { devuelto: true });

      res.status(200).json({ message: "Préstamo finalizado" }); // Confirmación de éxito
    } catch (error) {
      res.status(500).json({ error: error.message }); // Error interno del servidor
    }
  }

  // Método para eliminar un préstamo de la base de datos
  static async deletePrestamo(req, res) {
    try {
      // Llama al modelo para eliminar el préstamo con el ID proporcionado
      await Prestamo.deletePrestamo(req.params.id);
      res.json({ message: "Préstamo eliminado correctamente" }); // Mensaje de éxito
    } catch (error) {
      res.status(500).json({ error: error.message }); // Error interno del servidor
    }
  }
}

// Exportamos la clase para que pueda ser utilizada en el archivo de rutas
module.exports = PrestamoController;
// Fin del archivo prestamoController.js
// Este archivo contiene la lógica para manejar las operaciones relacionadas con los préstamos de libros en la aplicación.