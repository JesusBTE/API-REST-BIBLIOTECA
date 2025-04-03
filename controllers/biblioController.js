const Biblio = require("../models/biblio");
const admin = require("../config/config");
const db = admin.firestore();
const collection = db.collection("libros");

class biblioController {
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
      const books = await Biblio.getAllBooks(); // Llama al modelo para obtener todas los libros
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
      const book = await Biblio.getBookById(id);

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
    const existingBook = await Biblio.getBookById(req.params.id); // Obtener el libro

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
      await Biblio.deleteBook(req.params.id); // Llama al modelo para eliminar el libro por el ID
      res.status(204).json(); // Mensaje de éxito
    } catch (error) {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  }
}

// Exportamos la clase para que pueda ser utilizada en las rutas
module.exports = biblioController;
