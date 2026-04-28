const User = require("../models/user.model");
const Category = require("../models/category.model");
const Transaction = require("../models/transaction.model");

exports.createCategory = async (req, res) => {
  const { name, icon } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You should be logged in fot this",
      });
    }
    const category = await Category.create({ name, icon, userId });

    user.categories.push(category._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      createdCategory: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating category",
      error: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  const { userId } = req.params;
  try {
    // const user = await User.findById(userId).populate({
    //   path: "categories",
    //   options: { sort: { name: 1 } },
    // });

    const user = await User.findById(userId).populate({
      path: "categories",
      options: { sort: { name: 1 } },
      populate: {
        path: "transactions", // Populate transactions within categories
        options: { sort: { date: -1 } },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories: user.categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { categoryId, userId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let othersCategory = await Category.findOne({ name: "Others", userId });
    if (!othersCategory) {
      othersCategory = await Category.create({
        name: "Others",
        icon: "📂",
        userId,
        transactions: [],
      });
    }

    if (category.name === "Others") {
      othersCategory = await Category.create({
        name: "Others",
        icon: "📂",
        userId,
        transactions: [],
      });
    }

    const updatedTransactions = await Transaction.updateMany(
      { category: categoryId },
      { $set: { category: othersCategory._id } }
    );

    const transactionIds = await Transaction.find(
      { category: othersCategory._id },
      "_id"
    ).then((transactions) => transactions.map((t) => t._id));

    await Category.findByIdAndUpdate(
      othersCategory._id,
      { $addToSet: { transactions: { $each: transactionIds } } },
    );

    await Category.findByIdAndDelete(categoryId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { categories: categoryId } },
      { new: true }
    );

    if (!updatedUser.categories.includes(othersCategory._id)) {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { categories: othersCategory._id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory: category,
      reassignedTo: othersCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the category",
      error: error.message,
    });
  }
};
