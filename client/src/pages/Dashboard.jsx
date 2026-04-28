import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import RecentTransactions from "../components/RecentTransactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation, useParams } from "react-router-dom";
import Visualization from "@/components/Visualization";
import LoadingPage from "./LoadingPage";
import Header from "../components/Header";

const Dashboard = () => {
  const location = useLocation();
  const { userId } = useParams();

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [type, setType] = useState("all");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transType, setTransType] = useState("Expense");

  const [recentTransactions, setRecentTransactions] = useState([]);

  const [categories, setCategories] = useState([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const [loading, setLoading] = useState(false);


  function resetForm() {
    setCategory("");
    setAmount("");
    setDescription("");
    setTransType("Expense");
    setDate("");
    setTime("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/transaction/${userId}/createTransaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            amount,
            description,
            transType,
            date,
            time,
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData || "Transaction creation failed");
        setLoading(false);
        return;
      }
      fetchAllTransactions();
      fetchRecentTransactions();

      resetForm();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createCategory() {
    try {
      setCreating(true);
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/category/${userId}/createCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            icon,
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData || "Category creation failed");
        setLoading(false);
        return;
      }
      setCategories((prev) => [
        ...prev,
        { name, icon }, // Add the new category to the list
      ]);

      setName("");
      setIcon("");
      setCreating(false);
    } catch (error) {
      setCreating(false);
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategory() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/category/${userId}/getAllCategories`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error:",
          errorData || "Error while fetching recent transactions"
        );
        setLoading(false);
        return;
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentTransactions() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/transaction/${userId}/getRecentTransactions`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error:",
          errorData || "Error while fetching recent transactions"
        );
        setLoading(false);
        return;
      }
      const data = await response.json();
      setRecentTransactions((prev) => [...prev, ...data.transactions]);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllTransactions() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/transaction/${userId}/getAllTransactions`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error:",
          errorData || "Error while fetching recent transactions"
        );
        setLoading(false);
        return;
      }
      const data = await response.json();
      let newIncome = 0;
      let newExpense = 0;
      // let newBalance = 0;
      data.transactions.forEach((transaction) => {
        if (transaction.transType === "Income") {
          newIncome += transaction.amount;
          // newBalance += transaction.amount;
        } else if (transaction.transType === "Expense") {
          newExpense += transaction.amount;
          // newBalance -= transaction.amount;
        }
      });

      setIncome(newIncome);
      setExpense(newExpense);
      // setBalance(newBalance);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentTransactions();
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      {location.pathname !== "/loading" && <Header userId={userId} />}
      <div className="my-3 relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100dvh-5.5rem)] flex-1 flex md:flex-row flex-col items-center md:items-start gap-6 md:gap-6 ">
        <Sidebar tab={"dashboard"} />
        <main className="w-full flex-1">
          <header className="flex gap-2 sm:flex-row flex-col justify-between md:items-center w-full">
            <h1 className="text-4xl font-semibold">Dashboard</h1>
            <div className="flex justify-end w-full">
              {/* CREATE TRANSACTION */}
              <Dialog className="">
                <motion.div whileTap={{ scale: 0.95 }} className="w-max">
                  <DialogTrigger>
                    <p className="min-w-[120px] text-sm md:text-md md:px-4 py-2 rounded-md bg-black font-semibold !px-6 text-white hover:bg-black-2">
                      New Transaction
                    </p>
                  </DialogTrigger>
                </motion.div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Expense</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-2"
                  >
                    {/* category and amount */}
                    <div className="mt-4 flex sm:flex-row flex-col gap-2 sm:items-center">
                      <div className="flex-1 flex flex-col gap-1">
                        <label
                          htmlFor="category"
                          className="cursor-pointer text-[0.9rem] md:text-[1rem]"
                        >
                          Select Category
                        </label>
                        <Select
                          value={category}
                          onValueChange={(value) => setCategory(value)}
                        >
                          <SelectTrigger id="category" className="py-[0.6rem]">
                            <SelectValue placeholder="Choose One" />
                          </SelectTrigger>
                          {/* <SelectContent>
                          {!creating && (
                            <>
                              {categories?.map((item) => (
                                <SelectItem
                                  key={item._id}
                                  value={item.icon + " " + item.name}
                                >
                                  {item.icon} {item.name}
                                </SelectItem>
                              ))}
                              <Button
                                onClick={() => setCreating(true)}
                                label={"+ Category"}
                                className="hover:bg-gray-100  w-full text-gray-300"
                              />
                            </>
                          )}

                          {creating && (
                            <form
                              onSubmit={createCategory}
                              className="flex flex-col gap-2 w-full"
                            >
                              <input
                                type="text"
                                placeholder="Enter Name"
                                className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                              <input
                                type="text"
                                placeholder="Choose Icon"
                                className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
                                required
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Button
                                  label={"+ Create"}
                                  className="bg-black-2 text-white"
                                />
                                <Button
                                  label={"Cancel"}
                                  onClick={() => setCreating(false)}
                                  className="border"
                                />
                              </div>
                            </form>
                          )}
                        </SelectContent> */}
                          <SelectContent>
                            {categories?.map((item) => (
                              <SelectItem
                                key={item._id}
                                value={item.icon + " " + item.name}
                              >
                                {item.icon} {item.name}
                              </SelectItem>
                            ))}
                            <p className="text-sm text-gray-300 p-2 font-thin">
                              To add new category go to settings
                            </p>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 flex flex-col gap-1">
                        <label
                          htmlFor="amount"
                          className="cursor-pointer text-[0.9rem] md:text-[1rem]"
                        >
                          Amount
                        </label>
                        <input
                          type="number"
                          placeholder="€ 0"
                          id="amount"
                          min={0}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* description */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="description"
                        className="cursor-pointer text-[0.9rem] md:text-[1rem]"
                      >
                        Description
                      </label>
                      <Textarea
                        placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus, aut?"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm focus:none"
                        required
                      />
                    </div>

                    {/* type */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="type"
                        className="cursor-pointer text-[0.9rem] md:text-[1rem]"
                      >
                        Type
                      </label>
                      <RadioGroup
                        value={transType}
                        onValueChange={(value) => setTransType(value)}
                        className="flex gap-10"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Expense" id="expense" />
                          <label htmlFor="expense" className="cursor-pointer">
                            Expense
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="Income" id="income" />
                          <label htmlFor="income" className="cursor-pointer">
                            Income
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* date and time */}
                    <div className="mt-2 flex sm:flex-row flex-col sm:items-center gap-2 ">
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="date"
                          className="cursor-pointer text-[0.9rem] md:text-[1rem]"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          onChange={(e) => setDate(e.target.value)}
                          value={date}
                          id="date"
                          className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="time"
                          className="cursor-pointer text-[0.9rem] md:text-[1rem]"
                        >
                          Time
                        </label>
                        <input
                          type="time"
                          id="time"
                          onChange={(e) => setTime(e.target.value)}
                          value={time}
                          className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 flex items-center justify-center w-full "
                    >
                      <Button
                        label={"Create"}
                        className="bg-black w-full text-white"
                      />
                    </motion.div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              {/* <div className="bg-purple-200 border-purple-400 flex-1 border rounded-md p-2">
              <span>Balance</span>
              <h1 className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">
                €{balance}
              </h1>
            </div> */}
              <div className="bg-green-200 border-green-400 flex-1 border rounded-md p-2">
                <span>In Flow</span>
                <h1 className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">
                  €{income}
                </h1>
              </div>
              <div className="bg-red-200 border-red-400 flex-1 border rounded-md p-2">
                <span>Out Flow</span>
                <h1 className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">
                  €{expense}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-3 h-full flex lg:flex-row flex-col gap-4 md:items-start lg:min-h-[430px]">

            <RecentTransactions
              recentTransactions={recentTransactions}
              categories={categories}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
