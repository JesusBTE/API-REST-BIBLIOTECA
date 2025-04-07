const admin = require("../config/config");
const db = admin.firestore();
const collection = db.collection("autores");

class Autor {
    // Obtener todos los autores
    static async getAllAutores() {
      const snapshot = await collection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  
    // Crear un nuevo autor
    static async createAutor(data) {
      const nuevoAutor = await collection.add(data);
      const autorGuardado = await nuevoAutor.get();
  
      return {
        id: autorGuardado.id,
        ...autorGuardado.data()
      };
    }
  
  }

module.exports = Autor;