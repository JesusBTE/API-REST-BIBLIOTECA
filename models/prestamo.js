// Importamos la configuración de Firebase Admin
const admin = require("../config/config"); // Asegúrate de que la ruta sea correcta

// Accedemos a Firestore
const db = admin.firestore();
module.exports = db;

// Referencia a la colección "Prestamos" en Firestore
const collection = db.collection("prestamos");

class Prestamo {
  // Método para obtener todos los préstamos
  static async getAllPrestamos() {
    const snapshot = await collection.get(); // Obtiene todos los documentos de la colección
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Devuelve un array con los préstamos
  }

  // Método para obtener un préstamo por su ID
  static async getPrestamoById(id) {
    const doc = await collection.doc(id).get(); // Obtiene el documento por ID
    if (!doc.exists) throw new Error("Préstamo no encontrado"); // Si no existe, lanza un error
    return { id: doc.id, ...doc.data() }; // Devuelve el préstamo con su ID
  }

  // Método para crear un nuevo préstamo
  static async createPrestamo(prestamoData) {
    const docRef = await collection.add(prestamoData); // Agrega un nuevo préstamo a la colección
    return { id: docRef.id, ...prestamoData }; // Devuelve el préstamo creado con su nuevo ID
  }

  // Método para actualizar un préstamo existente
  static async updatePrestamo(id, updatedData) {
    await collection.doc(id).update(updatedData); // Actualiza el documento con el ID proporcionado
    return { id, ...updatedData }; // Devuelve el préstamo actualizado
  }

  // Método para eliminar un préstamo
  static async deletePrestamo(id) {
    await collection.doc(id).delete(); // Elimina el préstamo por ID
    return { id, message: "Préstamo eliminado" }; // Mensaje de confirmación
  }
}

// Exportamos la clase Prestamo para su uso en el controlador
module.exports = Prestamo;