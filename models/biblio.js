const admin = require("../config/config"); // Asegúrate de que la ruta sea correcta

const db = admin.firestore();
module.exports = db;

const collection = db.collection("libros");

class Biblio {
  static async createBook(bookData) {
    const docRef = await collection.add(bookData);
    return { id: docRef.id, ...booktDataData };
  }

  static async getAllBooks() {
    const snapshot = await collection.get(); // Obtiene todos los documentos de la colección
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Devuelve un array con los libros
  }
  static async getBookById(id) {
    const doc = await collection.doc(id).get(); // Obtiene el documento por ID
    if (!doc.exists) {
      return null; // Si no existe, devolvemos null en lugar de lanzar un error
    }
    return { id: doc.id, ...doc.data() }; // Si existe, devolvemos el libro con su ID y los datos
  }

  static async updateBook(id, updatedData) {
    const bookData = await this.getBookById(id);
    // Actualizar el libro en la base de datos con los nuevos datos y los lugares disponibles recalculados.
    await collection.doc(id).update({
      ...updatedData, // Se mantiene el resto de los datos del libro, solo actualizando los necesarios
    });

    return { id, ...updatedData }; // Devuelve el libro actualizado
  }

  // Verifica si un libro tiene préstamos activos
  static async hasActiveLoans(libroId) {
    const prestamosSnapshot = await prestamosCollection
      .where("libroId", "==", libroId)
      .where("devuelto", "==", false)
      .get();

    return !prestamosSnapshot.empty; // Devuelve true si hay préstamos activos
  }

  static async deleteBook(id) {
    const docRef = collection.doc(id);
    const doc = await docRef.get(); // Obtener el documento antes de eliminar

    if (!doc.exists) {
      throw new Error("Libro no encontrado"); // Si no existe, lanzamos un error
    }

    // Verificar préstamos activos antes de eliminar
    const tienePrestamosActivos = await Biblio.hasActiveLoans(id);
    if (tienePrestamosActivos) {
      throw {
        status: 409,
        message: "No se puede eliminar por estar asociado a préstamos activos.",
      };
    }
    await docRef.delete(); // Ahora sí lo eliminamos
    return { id, message: "Libro eliminado" }; // Retornamos un mensaje confirmando la eliminación
  }
}

// Exportamos la clase libro para su uso en el controlador
module.exports = Biblio;
