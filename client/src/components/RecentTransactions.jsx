import React from "react";

const RecentTransactions = ({ recentTransactions, categories }) => {
  const uniqueTransactions = recentTransactions
    ?.filter(
      (transaction, index, self) =>
        index === self.findIndex((t) => t._id === transaction._id)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.icon + " " + category.name : "Others";
  };

  return (
    <div className="w-full border rounded-md p-2 md:min-h-[430px] !h-full lg:w-[300px] flex-1 flex flex-col justify-between">
      <h1 className="text-lg font-bold">Recent Transactions</h1>
      {uniqueTransactions.length === 0 && <p className="my-4 md:my-0 font-semibold text-gray-200 text-center text-3xl">No Transactions</p>}
      <ul className="mt-4 flex flex-col gap-3 overflow-y-scroll hide-scrollbar">
        {uniqueTransactions?.map((item) => (
          <li key={item._id} className="flex justify-between items-center">
            <div>
              <span className="font-semibold">{item.name}</span>
              <div className="text-sm text-gray-500">
                <span>{getCategoryName(item.category)}</span>
              </div>
            </div>
            <span
              className={`font-semibold ${
                item.transType === "Expense" ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.transType === "Expense" ? "-" : "+"} €{item.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
