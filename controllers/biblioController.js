const Biblio = require("../models/biblio");
const admin = require("../config/config");
const db = admin.firestore();
const collection = db.collection("libros");

class biblioController {
  static async createBook(req, res) {
    try {
      const eventData = req.body;
      const createdBook = await Biblio.createBook(eventData);
      res.status(201).json(createdBook);
    } catch (error) {
      console.error("Error al crear el evento:", error);
      res
        .status(400)
        .json({ message: "Error al crear el evento", error: error.message });
    }
  }
}

// Exportamos la clase para que pueda ser utilizada en las rutas
module.exports = biblioController;
