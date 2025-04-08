
const admin = require("../config/config"); 

const db = admin.firestore();
module.exports = db;

const collection = db.collection("libros");

class User {
  static async createUser(userData) {
    const docRef = await collection.add(userData);
    return { id: docRef.id, ...userDataData };
  }

  
}

// Exportamos la clase de libro para su uso en el controlador
module.exports = User;
