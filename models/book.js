const admin = require("../config/config"); // Asegúrate de que la ruta sea correcta
const Prestamo = require("./prestamo"); // <-- esta línea importa correctamente

const db = admin.firestore();
module.exports = db;

const collection = db.collection("libros");

class Book {
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
    const snapshot = await db
      .collection("prestamos")
      .where("libroId", "==", libroId)
      .where("activo", "==", true)
      .get();

    return !snapshot.empty;
  }

  // Método estático para eliminar un libro por su ID
  static async deleteBook(id) {
    // Referencia al documento del libro dentro de la colección
    const docRef = collection.doc(id);

    // Se obtiene el documento (libro) con el ID proporcionado
    const doc = await docRef.get();

    // Si el documento no existe, se lanza un error con estado 404
    if (!doc.exists) {
      throw {
        status: 404,
        message: "Libro no encontrado",
      };
    }

    // Se verifica si el libro tiene préstamos activos
    const tienePrestamosActivos = await Book.hasActiveLoans(id);

    // Si tiene préstamos activos, no se permite eliminar y se lanza error con estado 409 (conflicto)
    if (tienePrestamosActivos) {
      throw {
        status: 409,
        message: "No se puede eliminar por estar asociado a préstamos activos.",
      };
    }

    // Si el libro existe y no tiene préstamos activos, se procede a eliminar
    await docRef.delete();

    // Se retorna una respuesta indicando que el libro fue eliminado
    return { id, message: "Libro eliminado" };
  }
}

// Exportamos la clase de libro para su uso en el controlador
module.exports = Book;
