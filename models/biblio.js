const admin = require("../config/config"); // Asegúrate de que la ruta sea correcta

const db = admin.firestore();
module.exports = db;

const collection = db.collection("libros");

class Event {
  static async createBook(eventData) {
    const docRef = await collection.add(eventData);
    return { id: docRef.id, ...eventData };
  }
}

// Exportamos la clase Event para su uso en el controlador
module.exports = Event;
