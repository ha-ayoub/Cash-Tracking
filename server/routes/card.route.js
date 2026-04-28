const express = require("express");
const {
  createCard,
  getAllCards,
  deleteCard,
} = require("../controllers/cardController");
const router = express.Router();

router.post("/:userId/createCard", createCard);
router.get("/:userId/getAllCards", getAllCards);
router.delete("/:userId/deleteCard/:cardId", deleteCard);
module.exports = router;
