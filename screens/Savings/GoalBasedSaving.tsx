import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function GoalBasedSavings() {
  const [selected, setSelected] = useState<number | string>(0);

  return (
    <ScrollView>
      {selected === "" && (
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "orange",
            },
          }}
        />
      )}
    </ScrollView>
  );
}
