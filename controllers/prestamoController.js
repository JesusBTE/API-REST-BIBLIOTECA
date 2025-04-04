// Importamos el modelo Prestamo para interactuar con la base de datos
const Prestamo = require("../models/prestamo");
const admin = require("firebase-admin");
const db = admin.firestore();

class PrestamoController {
  // Método para obtener todos los préstamos
  static async getPrestamos(req, res) {
    try {
      const prestamos = await Prestamo.getAllPrestamos(); // Llama al modelo para obtener todos los préstamos
      res.json(prestamos); // Devuelve la lista de préstamos en formato JSON
    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores internos del servidor
    }
  }

  // Método para obtener un préstamo específico por su ID
  static async getPrestamoById(req, res) {
    try {
      const prestamo = await Prestamo.getPrestamoById(req.params.id); // Llama al modelo para buscar el préstamo por ID
      res.json(prestamo); // Si el préstamo existe, lo devuelve en formato JSON
    } catch (error) {
      res.status(404).json({ error: "Préstamo no encontrado" }); // Error si el préstamo no existe
    }
  }

  // Método para crear un nuevo préstamo
  static async createPrestamo(req, res) {
    try {
      const {libroId, usuarioId, fechaInicio, fechaFin, devuelto } = req.body;

      // Validar que los datos obligatorios estén presentes
      if (!libroId || !usuarioId || !fechaInicio || !fechaFin || !devuelto) {
        return res.status(400).json({ error: "Datos inválidos" });
      }

      // Verificar si el libro existe
      const libroRef = db.collection("libros").doc(libroId);
      const libroSnapshot = await libroRef.get();

      if (!libroSnapshot.exists) {
        return res.status(404).json({ error: "El libro no existe" });
      }

      // Verificar si el usuario existe
      const usuarioRef = db.collection("usuarios").doc(usuarioId);
      const usuarioSnapshot = await usuarioRef.get();

      if (!usuarioSnapshot.exists) {
        return res.status(404).json({ error: "El usuario no existe" });
      }

      // Verificar si el libro ya está prestado
      const prestamosRef = db.collection("prestamos");
      const prestamosSnapshot = await prestamosRef.where("libroId", "==", libroId).where("devuelto", "==", false).get();

      if (!prestamosSnapshot.empty) {
        return res.status(409).json({ error: "El libro no está disponible" });
      }

      // Si pasa todas las validaciones, se guarda el préstamo
      const newPrestamo = await Prestamo.createPrestamo(req.body);
      res.status(201).json(newPrestamo);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para actualizar un préstamo existente
  static async updatePrestamo(req, res) {
    try {
      await Prestamo.updatePrestamo(req.params.id, req.body); // Llama al modelo para actualizar el préstamo por ID
      res.json({ message: "Préstamo actualizado correctamente" }); // Mensaje de éxito
    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores internos del servidor
    }
  }

  // Método para finalizar un préstamo
  static async finalizarPrestamo(req, res) {
    try {
      const prestamo = await Prestamo.getPrestamoById(req.params.prestamoId);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      if (prestamo.devuelto) {
        return res.status(409).json({ error: "Préstamo ya finalizado" });
      }
      
      await Prestamo.updatePrestamo(req.params.prestamoId, { devuelto: true });
      res.status(200).json({ message: "Préstamo finalizado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para eliminar un préstamo
  static async deletePrestamo(req, res) {
    try {
      await Prestamo.deletePrestamo(req.params.id); // Llama al modelo para eliminar el préstamo por ID
      res.json({ message: "Préstamo eliminado correctamente" }); // Mensaje de éxito
    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores internos del servidor
    }
  }
}

// Exportamos la clase para que pueda ser utilizada en las rutas
module.exports = PrestamoController;