import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";


const { width, height } = Dimensions.get("window");

export const PieGraph = () => {

  return (
    <PieChart
      data={data}
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
    name: "Trousers",
    expense: 12,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
  },
  {
    name: "Shirts",
    expense: 48,
    color: "pink",
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
  },
  {
    name: "Tour",
    expense: 40,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
  },
];
