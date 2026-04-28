import React from "react";
import { Pie, PieChart, Label, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

const chartData = [
  {
    icon: "🍴",
    name: "Food",
    transactions: [
      {
        amount: 150,
        category: "674c147f48253b822df8cfb5",
        createdAt: "2024-12-03T06:57:29.436Z",
        date: "2024-10-26",
        description: "Lunch",
        time: "08:15",
        transType: "Expense",
        updatedAt: "2024-12-03T06:57:29.436Z",
        userId: "674c0b9f58b69811ba940900",
        __v: 0,
        _id: "674eabd9a4cb5035e919f18f",
      },
    ],
  },
  {
    icon: "💼",
    name: "Work",
    transactions: [
      {
        amount: 200,
        category: "674c147f48253b822df8cfb5",
        createdAt: "2024-12-03T06:57:29.436Z",
        date: "2024-10-27",
        description: "Business Lunch",
        time: "12:30",
        transType: "Expense",
        updatedAt: "2024-12-03T06:57:29.436Z",
        userId: "674c0b9f58b69811ba940900",
        __v: 0,
        _id: "674eabd9a4cb5035e919f18f",
      },
    ],
  },
  {
    icon: "🎁",
    name: "Gifts",
    transactions: [
      {
        amount: 100,
        category: "674c147f48253b822df8cfb5",
        createdAt: "2024-12-03T06:57:29.436Z",
        date: "2024-10-28",
        description: "Birthday Gift",
        time: "16:00",
        transType: "Expense",
        updatedAt: "2024-12-03T06:57:29.436Z",
        userId: "674c0b9f58b69811ba940900",
        __v: 0,
        _id: "674eabd9a4cb5035e919f18f",
      },
    ],
  },
];

const transformedData = chartData.map((item) => ({
  name: item.name,
  amount: item.transactions.reduce((acc, curr) => acc + curr.amount, 0), // Sum of amounts for each category
  fill: "var(--color-" + item.name.toLowerCase() + ")", // You can customize colors or use fixed ones
}));

const totalAmount = transformedData.reduce((acc, curr) => acc + curr.amount, 0);

const Visualization = ({ categories }) => {
  console.log(categories);
  return (
    <div className="border w-full flex flex-col items-center justify-center lg:w-auto h-full p-2 rounded-md">
      <div style={{ width: "600px", height: "350px" }}>
        <PieChart>
          <Tooltip />
          <Pie
            data={transformedData}
            dataKey="amount"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            labelLine={false}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {`${Math.round((value / totalAmount) * 100)}%`}
                </text>
              );
            }}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalAmount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 24}
                        className="fill-muted-foreground"
                      >
                        Total
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <div
          className="trend-indicator"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>
            Trending up by 5.2% this month
          </span>
          <TrendingUp className="h-4 w-4" />
        </div>
        <p style={{ fontSize: "14px", color: "#777" }}>
          Spending distribution for the past month
        </p>
      </div>
    </div>
  );
};

export default Visualization;
