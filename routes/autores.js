const express = require("express");
const router = express.Router();
const autorController = require("../controllers/autorController");

router.get("/", autorController.getAutores);
router.post("/", autorController.createAutor);

module.exports = router;