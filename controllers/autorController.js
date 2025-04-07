const Autor = require("../models/autor");
const admin = require("firebase-admin");
const db = admin.firestore();

class AutorController {
  // Crear autor
  static async createAutor(req, res) {
    try {
      const { autorId, nombre, nacionalidad, fechaNacimiento } = req.body;

      if (!autorId || !nombre || !nacionalidad || !fechaNacimiento) {
        return res.status(400).json({ error: "Datos inválidos o incompletos" });
      }

      // Verificar si ya existe un autor con el mismo ID
      const autorRef = db.collection("autores").doc(autorId);
      const autorDoc = await autorRef.get();

      if (autorDoc.exists) {
        return res.status(409).json({ error: "Autor ya registrado" });
      }

      const now = new Date().toISOString();
      const autorData = {
        autorId,
        nombre,
        nacionalidad,
        fechaNacimiento,
        createdAt: now,
        updatedAt: now
      };

      await autorRef.set(autorData);
      res.status(201).json({ message: "Autor registrado", autor: autorData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener todos los autores
  static async getAutores(req, res) {
    try {
      const autores = await Autor.getAllAutores();
      res.status(200).json(autores);
    } catch (error) {
      res.status(500).json({ error: "Fallo al recuperar los datos" });
    }
  }
}

module.exports = AutorController;