import React from "react";
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
import { Button } from "./ui/button";

const AppDrawer = ({ transactions, categories, getCategoryName }) => {
  const transType = "Expense";
  return (
    <Drawer className="">
      <DrawerTrigger className="w-full border border-gray-100 p-2 rounded-md">
        <div className="w-full flex items-center gap-2">
          <div className="bg-gray-100 p-2 rounded-md">🚌</div>
          <div className="w-full text-sm ">
            <div className="flex justify-between items-center">
              {/* <h4 className="font-medium text-[1rem]">
                Transaction Description
              </h4> */}
              <p className="flex flex-col items-start">
                <span className="font-medium text-[1rem]">
                  {getCategoryName()}asd
                </span>
                <span className="text-gray-400 font-medium">
                  Nov 30, 2024, 5:42 pm
                </span>
              </p>
              <p
                className={`text-[1rem] font-semibold ${
                  transType === "Expense" ? "text-red-600" : "text-green-600"
                } `}
              >
                {" "}
                {transType === "Expense" ? "-" : "+"} €1000
              </p>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Transaction Details</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 flex items-center gap-2">
          <div className="border p-2 rounded-md">🚌</div>
          <div className="w-full text-sm flex items-center justify-between">
            {/* <h4 className="font-medium text-[1rem]">Transaction Description</h4> */}
            <p className="flex flex-col ">
              <span className="font-medium text-[1rem]">Transportation</span>
              <span className="text-gray-400 font-thin">
                Nov 30, 2024, 5:42 pm
              </span>
            </p>
            <h1
              className={`my-4 text-center text-2xl font-semibold ${
                transType === "Expense" ? "text-red-600" : "text-green-600"
              }`}
            >
              {transType === "Expense" ? "-" : "+"} €100
            </h1>
          </div>
        </div>
        <div className="px-4">
          <h1>Transaction Description</h1>
          <p className="text-gray-400 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            commodi amet ad aliquid architecto tempore blanditiis temporibus
            dolore nisi necessitatibus.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose className="w-full">
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AppDrawer;
