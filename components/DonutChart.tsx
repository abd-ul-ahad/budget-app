import React, { FC } from "react";

import {
  Canvas,
  Path,
  SkFont,
  Skia,
  SkiaMutableValue,
  Text,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

interface CircularProgressProps {
  strokeWidth: number;
  radius: number;
  backgroundColor: string;
  percentageComplete: SkiaMutableValue<number>;
  font: SkFont;
  smallerFont: SkFont;
  targetPercentage: number;
  is100Mode?: boolean;
}

export const DonutChart: FC<CircularProgressProps> = ({
  strokeWidth,
  radius,
  percentageComplete,
  font,
  targetPercentage,
  smallerFont,
  is100Mode = false,
  backgroundColor
}) => {
  const colorScheme = useColorScheme();
  const innerRadius = radius - strokeWidth / 2;
  const targetText =
    is100Mode === true ? `${targetPercentage}` : `${targetPercentage * 100}`;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const width = font.getTextWidth(targetText);
  const titleWidth = smallerFont.getTextWidth("Power");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <Canvas
        style={{
          flex: 1,
          backgroundColor,
        }}
      >
        <Path
          path={path}
          color="#3b7250"
          style="stroke"
          strokeJoin="round"
          strokeWidth={strokeWidth}
          strokeCap="round"
          start={0}
          end={percentageComplete}
        />
        <Path
          path={path}
          color="rgba(59, 114, 80, 0.2)"
          style="stroke"
          strokeJoin="round"
          strokeWidth={strokeWidth}
          strokeCap="round"
          start={0}
          end={100}
        />
        <Text
          x={innerRadius - width / 2}
          y={radius + strokeWidth}
          text={`${targetText}%`}
          font={font}
          opacity={1}
          color="black"
        />
        <Text
          x={innerRadius - titleWidth / 2}
          y={radius + 45}
          text={"Saved"}
          font={smallerFont}
          opacity={1}
          color="black"
        />
      </Canvas>
    </View>
  );
};
