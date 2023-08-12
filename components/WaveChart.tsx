import { View } from "../components/Themed";
import {
  Alert,
  Dimensions,
  useColorScheme,
} from "react-native";
import Colors from "../constants/Colors";
import {
  Skia,
  Canvas,
  Path,
  Vertices,
  vec,
  useComputedValue,
  useClockValue,
  useValue,
  useTouchHandler,
  LinearGradient,
  Text,
  useFont,
} from "@shopify/react-native-skia";

import { line, curveBasis } from "d3";

const dimens = Dimensions.get("screen");
const width = 150;
const frequency = 2;
const initialAmplitude = 2;
const verticalShiftConst = 100;
const height = 600;
const horizontalShift = (dimens.width - width) / 2;
const indicatorArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function WaveChart() {
  const colorScheme = useColorScheme();
  const verticalShift = useValue(verticalShiftConst);
  const font = useFont(require("../assets/fonts/SpaceMono-Regular.ttf"), 20);
  const amplitude = useValue(initialAmplitude);
  const clock = useClockValue();
  const touchHandler = useTouchHandler({
    onActive: ({ y }) => {
      if (y > verticalShiftConst) {
        verticalShift.current = Math.min(height, y);
        amplitude.current = Math.max(
          0,
          (height - verticalShift.current) * 0.025
        );
      }
    },
  });

  const createWavePath = (phase = 20) => {
    let points = Array.from({ length: width + horizontalShift }, (_, index) => {
      const angle =
        ((index - horizontalShift) / width) * (Math.PI * frequency) + phase;
      return [
        index,
        amplitude.current * Math.sin(angle) + verticalShift.current,
      ];
    });

    const shiftedPoints = points.slice(horizontalShift, 300) as [
      number,
      number
    ][];
    const lineGenerator = line().curve(curveBasis);
    const waveLine = lineGenerator(shiftedPoints);
    const bottomLine = `L${
      width + horizontalShift
    },${height} L${horizontalShift},${height}`;
    const extendedWavePath = `${waveLine} ${bottomLine} Z`;
    return extendedWavePath;
  };

  const animatedPath = useComputedValue(() => {
    const current = (clock.current / 225) % 225;
    const start = Skia.Path.MakeFromSVGString(createWavePath(current))!;
    const end = Skia.Path.MakeFromSVGString(createWavePath(Math.PI * current))!;
    return start.interpolate(end, 0.5)!;
  }, [clock, verticalShift]);

  const trianglePath = useComputedValue(() => {
    return [
      vec(horizontalShift * 2.6, verticalShift.current - 20),
      vec(horizontalShift * 2.6, verticalShift.current + 20),
      vec(horizontalShift * 2.3, verticalShift.current),
    ];
  }, [verticalShift]);

  const gradientStart = useComputedValue(() => {
    return vec(0, verticalShift.current);
  }, [verticalShift]);

  const gradientEnd = useComputedValue(() => {
    return vec(0, verticalShift.current + 150);
  }, [verticalShift]);

  const getLabelYValueOffset = (position: number) => {
    return verticalShiftConst + 50 * position;
  };

  const getYLabelValue = (position: number) => {
    return `${position}%`;
  };

  const alertValue = () => {
    const adjustedShift =
      (verticalShiftConst - verticalShift.current) /
        (height - verticalShiftConst) +
      1;

    Alert.alert("VALUE", `Your value is: ${Math.round(adjustedShift * 100)}`);
  };

  if (!font) {
    return <View />;
  }

  return (
    <Canvas style={{ flex: 1 }} onTouch={touchHandler}>
      {indicatorArray.map((val, i) => {
        return (
          <Text
            key={val.toString()}
            x={50}
            y={getLabelYValueOffset(val)}
            text={getYLabelValue((indicatorArray.length - i - 1) * 10)}
            font={font}
            color={Colors[colorScheme ?? "light"].text}
          />
        );
      })}
      <Path path={animatedPath} style="fill">
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={["orange", "yellow"]}
        />
      </Path>
      <Vertices vertices={trianglePath} color={"#767676"} />
    </Canvas>
  );
}
