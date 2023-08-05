import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Home from "./home";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Category from "./category";
import Transaction from "./transaction";
import PlanScreen from "./plan";
import Profile from "./profile";
import { useTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

const Tab = createMaterialBottomTabNavigator();

export default function MainTabs() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";

  const colorScheme = useColorScheme();

  console.log(colorScheme);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={Colors[colorScheme ?? "light"].tint}
      sceneAnimationEnabled={true}
      inactiveColor={"#767676"}
      shifting={true}
      barStyle={{
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
        marginVertical: -8,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          tabBarLabel: "Category",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="category" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarLabel: "Transaction",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare-arrows" size={35} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{
          tabBarLabel: "Category",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-document-edit"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-settings" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
