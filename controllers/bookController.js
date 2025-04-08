const Book = require("../models/book");
const admin = require("../config/config");
const db = admin.firestore();
const collection = db.collection("libros");

class bookController {
  static async createBook(req, res) {
    try {
      const bookData = req.body;

      // Verificar si ya existe un libro con el mismo ISBN
      const existingBook = await collection
        .where("isbn", "==", bookData.isbn)
        .get();
      if (!existingBook.empty) {
        return res.status(409).json({
          message: "Ya existe un libro con ese ISBN",
        });
      }

      // Crear el libro en Firestore
      const createdBookRef = await collection.add(bookData);
      const createdBook = { id: createdBookRef.id, ...bookData };

      res.status(201).json({
        message: "Libro registrado correctamente",
        createdBook,
      });
    } catch (error) {
      res.status(400).json({
        message: "Datos incompletos o mal formateados",
        error: error.message,
      });
    }
  }

  // Método para obtener todas los libros
  static async getBooks(req, res) {
    try {
      const books = await Book.getAllBooks(); // Llama al modelo para obtener todas los libros
      res.status(200).json({ message: "Lista de libros retornada", books }); // Devuelve la lista de libros en formato JSON
    } catch (error) {
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }
  static async getBookById(req, res) {
    const { id } = req.params;

    // Validar que el ID sea una cadena alfanumérica no vacía
    const idRegex = /^[a-zA-Z0-9]+$/; // Expresión regular para validar IDs alfanuméricos

    if (!id || !idRegex.test(id)) {
      return res.status(400).json({ error: "ID inválido" }); // Si el ID no es alfanumérico o está vacío
    }

    try {
      // Llamar al modelo para buscar el libro por ID
      const book = await Book.getBookById(id);

      // Si el libro no existe
      if (!book) {
        return res.status(404).json({ error: "El libro no existe" });
      }

      // Si se encuentra el libro, devolverlo
      res.status(200).json(book); // Información del libro en formato JSON
    } catch (error) {
      // Manejar cualquier otro error general y devolver un 404 en este caso
      res.status(404).json({ error: "El libro no existe" });
    }
  }

  static async updateBook(req, res) {
    // Obtener los datos enviados en la solicitud (en el cuerpo de la solicitud)
    const bookData = req.body; // Datos enviados en la solicitud

    if (
      !bookData.nombre ||
      !bookData.isbn ||
      !bookData.autorId ||
      !bookData.genero ||
      !bookData.añoPublicacion
    ) {
      return res.status(400).json({
        message: "Datos mal estructurados, falta información requerida",
      });
    }

    // Buscar el libro actual en la base de datos usando el ID
    const existingBook = await Book.getBookById(req.params.id); // Obtener el libro

    // Si el libro no existe, respondemos con un error
    if (!existingBook) {
      return res.status(404).json({ message: "El libro no existe" }); // Respuesta de error si el libro no se encuentra
    }

    // Si la actualización es exitosa, enviamos una respuesta con los datos actualizados del libro
    res.status(200).json({
      message: "Actualización exitosa",
      bookData: {
        ...bookData, // Devuelve todo el body params actualizado
      },
    });
  }
  static async deleteBook(req, res) {
    try {
      await Book.deleteBook(req.params.id); // Llama al modelo para eliminar el libro por el ID
      res.status(204).json(); // Mensaje de éxito
    } catch (error) {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  }


static async checkAvailability(req, res) {
  try {
    const { libroId } = req.params;
    
    // Validar ID del libro
    if (!libroId || typeof libroId !== 'string') {
      return res.status(400).json({ error: 'ID de libro inválido' });
    }
    
    const availability = await Book.checkAvailability(libroId);
    
    if (!availability) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    
    res.status(200).json(availability);
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
}

static async searchBooks(req, res) {
  try {
    const { genero, autor, año, disponible } = req.query;
    
    // Validaciones
    if (año && isNaN(parseInt(año))) {
      return res.status(400).json({ error: 'El año debe ser un número válido' });
    }
    
    const filters = {};
    if (genero) filters.genero = genero;
    if (autor) filters.autor = autor;
    if (año) filters.año = parseInt(año);
    if (disponible) filters.disponible = disponible === 'true';
    
    const books = await Book.searchBooks(filters);
    
    if (books.length === 0) {
      return res.status(200).json({ 
        message: 'No se encontraron libros con los criterios especificados',
        results: []
      });
    }
    
    res.status(200).json({
      message: 'Búsqueda exitosa',
      count: books.length,
      results: books
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ 
      error: 'Error al buscar libros',
      details: error.message 
    });
  }
}



}

// Exportamos la clase para que pueda ser utilizada en las rutas
module.exports = bookController;
