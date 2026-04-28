import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import LoadingPage from "./LoadingPage";
import Header from "../components/Header";

const AllTransactions = () => {
  const location = useLocation();

  const { userId } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  async function deleteTransaction(transactionId) {
    try {
      // setLoading(true);
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.id !== transactionId
        )
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/transaction/${userId}/deleteTransaction/${transactionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("An Error Occurred");
        console.log(response);
        throw new Error(response.statusText);
      }

      window.location.reload();

      // const data = await response.json();

      toast.success("Transaction Deleted");
    } catch (error) {
      toast.error("An Error Occurred");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const transactionsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/transaction/${userId}/getTransactionsLimited?page=${currentPage}&limit=8`,
          { credentials: "include" }
        );

        if (!transactionsResponse.ok) {
          toast.error("Failed to fetch transactions");
          setLoading(false);
          return;
        }

        const transactionsData = await transactionsResponse.json();

        if (transactionsData.success) {
          setTransactions(transactionsData.transactions);
          setTotalPages(transactionsData.totalPages || 1);
        } else {
          toast.error("Failed to load transactions");
        }

        const categoriesResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/category/${userId}/getAllCategories`,
          { credentials: "include" }
        );

        if (!categoriesResponse.ok) {
          const errorData = await categoriesResponse.json();
          console.error(
            "Error fetching categories:",
            errorData || "Unknown error"
          );
          toast.error("Failed to fetch categories");
          setLoading(false);
          return;
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("An error occurred while fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, userId]);

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? `${category.icon}` : "📂";
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? `${category.name}` : "Others";
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      {location.pathname !== "/loading" && <Header  />}
      <div className='mt-3 relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100dvh-5.1rem)] flex-1 flex md:flex-row flex-col items-center md:items-start gap-6 md:gap-6 pb-10"'>
        <Sidebar tab={"transactions"} />
        <main className="flex flex-col w-full flex-1 md:min-h-[calc(100dvh-6rem)]">
          <header className="flex gap-2 sm:flex-row flex-col justify-between md:items-center w-full">
            <h1 className="text-4xl font-semibold">All Transactions</h1>
          </header>

          <div className="hidden md:block   border-2 rounded-lg mt-6 hide-scrollbar  overflow-y-scroll max-h-[70vh]">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="">Category</TableHead>
                  <TableHead className="">Description</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {transactions?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium text-left">
                      {getCategoryIcon(item.category)}{" "}
                      {getCategoryName(item.category)}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-center">{item.date}</TableCell>
                    <TableCell
                      className={`text-center font-semibold ${
                        item.transType === "Expense"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.transType === "Expense" ? "-" : "+"} €{item.amount}
                    </TableCell>
                    <TableCell className="text-center cursor-pointer">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <i className="ri-delete-bin-7-line" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your transaction and remove
                              your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTransaction(item._id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Visible only on smaller screens */}
          <div className="flex-1 flex flex-col gap-2 mt-6 md:hidden">
            {transactions?.map((item) => (
              <Drawer className="" key={item._id}>
                <DrawerTrigger className="w-full border border-gray-100 p-2 rounded-md">
                  <div className="w-full flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-md">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="w-full text-sm ">
                      <div className="flex justify-between items-center">
                        <p className="flex flex-col items-start">
                          <span className="font-medium text-[1rem]">
                            {getCategoryName(item.category)}
                          </span>
                          <span className="text-gray-400 font-medium">
                            {/* Nov 30, 2024, 5:42 pm */}
                            {item.time} | {item.date}
                          </span>
                        </p>
                        <p
                          className={`text-[1rem] font-semibold ${
                            item.transType === "Expense"
                              ? "text-red-600"
                              : "text-green-600"
                          } `}
                        >
                          {" "}
                          {item.transType === "Expense" ? "-" : "+"} €
                          {item.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="text-xl">
                      Transaction Details
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 flex items-center gap-2">
                    <div className="border p-2 rounded-md">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="w-full text-sm flex items-center justify-between">
                      <p className="flex flex-col ">
                        <span className="font-medium text-[1rem]">
                          {getCategoryName(item.category)}
                        </span>
                        <span className="text-gray-400 font-thin">
                          {item.time} | {item.date}
                        </span>
                      </p>
                      <h1
                        className={`my-4 text-center text-2xl font-semibold ${
                          item.transType === "Expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.transType === "Expense" ? "-" : "+"} €
                        {item.amount}
                      </h1>
                    </div>
                  </div>
                  <div className="px-4 mt-2">
                    <h1 className="text-gray-400 text-sm font-medium">
                      Transaction Description
                    </h1>
                    <p className=" text-md font-medium">{item.description}</p>
                  </div>
                  <DrawerFooter className="flex">
                    <Button
                      onClick={() => deleteTransaction(item._id)}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                    <DrawerClose className="w-full">
                      <Button variant="outline" className="w-full">
                        Close
                      </Button>
                      {/* <Button label="Close" /> */}
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ))}
          </div>

          {/* {totalPages > 1 && ( */}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage !== 1
                      ? "cursor-pointer"
                      : "cursor-not-allowed hover:bg-transparent"
                  }`}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "bg-gray-100" : ""}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage !== totalPages
                      ? "cursor-pointer"
                      : "cursor-not-allowed hover:bg-transparent"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          {/* )} */}
        </main>
        <ToastContainer />
      </div>
    </>
  );
};

export default AllTransactions;
