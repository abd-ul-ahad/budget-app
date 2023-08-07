// Import required components and modules
import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { FadeInView } from "../../components/animations";
import { useEffect, useState } from "react";

import Single from "../../components/category/Single";
import AddEdit from "../../components/category/AddEdit";
import { useFirestore } from "../../firebase/useFirestore";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { RefreshControl } from "react-native";

// Define the Spending component
export default function Category() {
  // Get the current color scheme
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);
  const { getDocument } = useFirestore("categories", user.uid!);

  // State variables
  const [toggle, setToggle] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [payload, setPayload] = useState<{ id: string; category: string }>({
    id: "",
    category: "",
  });
  const [resp, setResp] =
    useState<Array<{ id: string; description: string }>>();
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const d = await getDocument();
    let r: any = [];
    d?.forEach((e: any) => {
      r.push({ description: e._data.description, id: e.id });
    });

    setResp(r);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [reloadState]);

  // Render the componen
  return (
    <>
      {/* Render AddEdit component if 'toggle' is true */}
      {toggle && (
        <AddEdit
          isNew={isNew}
          setToggle={setToggle}
          payload={payload}
          setPayload={setPayload}
        />
      )}

      {/* SafeAreaView to handle safe area for different devices */}
      <SafeAreaView>
        {/* Fade in the ScrollView */}
        <FadeInView _duration={300}>
          {/* ScrollView to provide scrollable content */}
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={load} />
            }
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
              height: "100%",
            }}
          >
            {/* Categories header */}
            <View className="flex justify-center items-start pt-5 pb-3">
              <Text className="text-xl font-semibold tracking-wider pl-3">
                Categories
              </Text>
            </View>

            {/* Container for categories */}
            <View className="pt-3 mb-10 space-y-2 px-3">
              {/* Button to add a new category */}
              <TouchableOpacity
                onPress={() => {
                  setPayload({ id: "", category: "" });
                  setToggle(true);
                  setIsNew(true);
                }}
                className="flex justify-center items-center rounded-lg"
                style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
              >
                <Text className="text-white py-3">New Category</Text>
              </TouchableOpacity>

              {/* Container for existing categories */}
              <View className="py-3">
                {resp?.length === 0 && (
                  <View className="h-screen">
                    <Text className="w-full text-center pb-2 mt-2">
                      No Category
                    </Text>
                  </View>
                )}
                {/* Render existing categories */}
                {resp?.map((e, i, a) => (
                  <View key={i}>
                    {/* TouchableOpacity for each category */}
                    <TouchableOpacity
                      className="py-3"
                      onPress={() => {
                        setPayload({ id: e.id, category: e.description });
                        setToggle(true);
                        setIsNew(false);
                      }}
                    >
                      {/* Render Single component */}
                      <Single title={e.description} />
                    </TouchableOpacity>

                    {/* Divider between categories */}
                    {a.length - 1 !== i && (
                      <View
                        style={{ height: 1, backgroundColor: "gray" }}
                        className="w-full"
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </FadeInView>
      </SafeAreaView>
    </>
  );
}
