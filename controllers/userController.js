const User = require("../models/user");
const admin = require("../config/config");
const db = admin.firestore();
const collection = db.collection("libros");

class userController {
  static async createUser(req, res) {
    try {
      const userData = req.body;

      // Verificar si ya existe un usuario con el mismo email
      const existingUser = await collection
        .where("email", "==", userData.email)
        .get();
      if (!existingUser.empty) {
        return res.status(409).json({
          message: "Email ya registrado",
        });
      }

      // Crear el usuario en Firestore
      const createdUserRef = await collection.add(userData);
      const createdUser = { id: createdUserRef.id, ...userData };

      res.status(201).json({
        message: "Usuario creado correctamente",
        createdUser,
      });
    } catch (error) {
      res.status(400).json({
        message: "Datos mal proporcionados",
        error: error.message,
      });
    }
  }
}

// Exportamos la clase para que pueda ser utilizada en las rutas
module.exports = userController;
