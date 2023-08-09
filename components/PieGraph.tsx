import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");

interface ExpenseSummaryItem {
  color: string;
  expense: number;
  legendFontColor: string;
  legendFontSize: number;
  name: string;
}

const initialExpenseSummary: ExpenseSummaryItem[] = [
  {
    color: "#45DCCC",
    expense: 0,
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
    name: "Shopping",
  },
];

export const PieGraph = ({
  transactions,
}: {
  transactions: Array<any> | undefined;
}) => {
  const [chartData, setChartData] = useState<Array<ExpenseSummaryItem>>(
    initialExpenseSummary
  );
  useEffect(() => {
    let categoryExpenses: any = {};

    transactions?.forEach((transaction) => {
      if (transaction._data.category !== "#income") {
        if (transaction._data.category in categoryExpenses) {
          categoryExpenses[transaction._data.category] +=
            transaction._data.amount;
        } else {
          categoryExpenses[transaction._data.category] =
            transaction._data.amount;
        }
      }
    });

    const expenseSummary = Object.keys(categoryExpenses).map((category) => ({
      name: category,
      expense: categoryExpenses[category],
      color: getRandomColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    }));

    setChartData(expenseSummary);
  }, [transactions]);

  return (
    <PieChart
      data={chartData.length === 0 ? data : chartData}
      width={width}
      height={height / 3.3}
      chartConfig={chartConfig}
      accessor={"expense"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
    />
  );
};
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const data = [
  {
    name: "No Expense",
    expense: 100,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
  },
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
