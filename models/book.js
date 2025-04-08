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

static async getBookById(id) {
  // Cambiamos para buscar por libroId en lugar del ID de Firebase
  const snapshot = await collection.where('libroId', '==', id).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  // Tomamos el primer documento (asumiendo que libroId es único)
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

// En models/book.js (dejar solo una versión)
static async searchBooks(filters = {}) {
  console.log('Filtros recibidos en modelo:', filters);
  let query = collection;
  
  
  if (filters.genero) {
    console.log(`Buscando por género: ${filters.genero}`);
    query = query.where('genero', '==', filters.genero);
  }
  
  if (filters.autor) {
    const autoresSnapshot = await db.collection('autores')
      .where('nombre', '>=', filters.autor)
      .where('nombre', '<=', filters.autor + '\uf8ff')
      .get();
    
    const autorIds = autoresSnapshot.docs.map(doc => doc.id); // Cambiado a doc.id
    if (autorIds.length > 0) {
      query = query.where('autorId', 'in', autorIds);
    } else {
      return []; // No hay autores que coincidan
    }
  }
  
  if (filters.año) {
    query = query.where('añoPublicacion', '==', parseInt(filters.año));
  }
  
  if (filters.disponible !== undefined) {
    query = query.where('existencia', '==', filters.disponible);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

static async checkAvailability(libroId) {
  const snapshot = await collection.where('libroId', '==', libroId).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { 
    libroId: doc.data().libroId,
    disponible: doc.data().existencia 
  };
}

static async getBooksByAutor(autorId) {
  // Verificar si el autor existe
  const autorSnapshot = await db.collection('autores')
    .where('autorId', '==', autorId)
    .get();
  
  if (autorSnapshot.empty) {
    return null;
  }
  
  // Buscar libros del autor
  const librosSnapshot = await collection
    .where('autorId', '==', autorId)
    .get();
  
  return librosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


}

// Exportamos la clase de libro para su uso en el controlador
module.exports = Book;
