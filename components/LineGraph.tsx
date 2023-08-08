import { Dimensions, useColorScheme } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useState } from "react";

export const LineGraph = ({
  _labels,
  _data,
}: {
  _labels: string[];
  _data: number[];
}) => {
  return (
    <LineChart
      data={{
        labels: _labels,
        datasets: [
          {
            data: _data,
          },
        ],
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisLabel="£"
      yAxisSuffix=""
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#3b7250",
        backgroundGradientFrom: "#3b7250",
        backgroundGradientTo: "#3b7250",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#3b7250",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 8,
      }}
    />
  );
};
