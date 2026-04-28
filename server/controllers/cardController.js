const Card = require("../models/card.model");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");

exports.createCard = async (req, res) => {
  const { name, balance, color } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const card = await Card.create({
      userId: user._id,
      name,
      balance,
      color,
    });

    user.cards.push(card._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Card created successfully",
      card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the card",
      error: error.message,
    });
  }
};

exports.getAllCards = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cards = await Card.find({ userId }).populate("transactions");

    res.status(200).json({
      success: true,
      message: "Cards fetched successfully",
      cards,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "An error occurred",
      error,
    });
  }
};

exports.deleteCard = async (req, res) => {
  const { userId, cardId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const transactionsToDelete = await Transaction.find({ cardId });
    await Transaction.deleteMany({ cardId });

    const transactionIds = transactionsToDelete.map((t) => t._id);
    await User.findByIdAndUpdate(
      userId,
      { $pull: { transactions: { $in: transactionIds }, cards: cardId } },
      { new: true }
    );

    for (const transaction of transactionsToDelete) {
      await Category.findByIdAndUpdate(
        transaction.category,
        { $pull: { transactions: transaction._id } },
        { new: true }
      );
    }

    await Card.findByIdAndDelete(cardId);

    await Transaction.findById();

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the card",
      error: error.message,
    });
  }
};
