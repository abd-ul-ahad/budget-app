import Colors from "../constants/Colors";
import { View } from "./Themed";
import { useColorScheme } from "react-native";

export default function ProgressBar({progress}: {progress: number}) {
  return (
    <>
      <View
        style={{
          height: 10,
          width: "100%",
          backgroundColor: "rgba(59, 114, 80, 0.1)" 
          ,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: "#fdd300",
            borderRadius: 5,
          }}
        />
      </View>
    </>
  );
}
