const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");
const Card = require("../models/card.model");

exports.createTransaction = async (req, res) => {
  const { userId } = req.params;
  const { category, amount, description, transType, date, time } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [icon, name] = category.split(" ", 2);

    const categoryDoc = await Category.findOne({ name });
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const parsedAmount = Number(amount);

    const transaction = await Transaction.create({
      userId,
      category: categoryDoc._id,
      amount: parsedAmount,
      description,
      transType,
      date,
      time,
    });

    user.transactions.push(transaction._id);
    await user.save();

    categoryDoc.transactions.push(transaction._id);
    await categoryDoc.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the transaction",
      error: error.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching transactions",
      error: error.message,
    });
  }
};

exports.getTransactionLimited = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 8 } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching transactions",
      error: error.message,
    });
  }
};

exports.getRecentTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(11);

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching transactions",
      error: error.message,
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { userId, transactionId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await Category.findByIdAndUpdate(
      transaction.category, // Use the category field from the transaction
      { $pull: { transactions: transactionId } }, // Remove the transaction ID
      { new: true }
    );

    await Transaction.findByIdAndDelete(transactionId);

    await User.findByIdAndUpdate(
      userId,
      { $pull: { transactions: transactionId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the transaction",
      error: error.message,
    });
  }
};

exports.getMonthlyTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
  } catch (error) {}
};

exports.getYearlyTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
  } catch (error) {}
};
