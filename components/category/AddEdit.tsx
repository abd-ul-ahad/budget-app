import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { FadeInView } from "../animations";
import { Text, View } from "../Themed";
import { Ionicons, Octicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useFirestore } from "../../firebase/useFirestore";
import { SetStateAction, useState } from "react";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../store/slices/snackSlice";
import { reload } from "../../store/slices/reloadSlice";

export default function AddEdit({
  setToggle,
  payload,
  setPayload,
  isNew,
}: {
  isNew: boolean;
  payload: { id: string; category: string };
  setPayload: React.Dispatch<SetStateAction<{ id: string; category: string }>>;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  const { addDocument, updateDocument } = useFirestore("categories", user.uid!);

  const Submit = async () => {
    if (payload?.category!.length >= 1) {
      setLoading(true);
      const d = addDocument({
        code: payload.category,
        description: payload.category,
      }).then(() => setToggle(false));
      setLoading(false);
      dispatch(set({ toggle: true, msg: "Category added" }));
      dispatch(reload());
    } else {
      dispatch(set({ toggle: true, msg: "Field is empty" }));
    }
  };

  const Update = async () => {
    if (payload.category.length >= 1) {
      setLoading(true);
      const d = updateDocument(
        {
          code: payload.category,
          description: payload.category,
        },
        payload.id
      ).then(() => setToggle(false));
      setLoading(false);
      dispatch(set({ toggle: true, msg: "Category Updated" }));
      dispatch(reload());
    } else {
      dispatch(set({ toggle: true, msg: "Field is empty" }));
    }
  };

  return (
    <FadeInView _duration={150}>
      <View
        style={{
          backgroundColor:
            colorScheme === "light"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
        }}
        className="w-full flex justify-center items-center h-screen py-4 px-2"
      >
        <View className="rounded-xl w-full pb-10 px-4 pt-8">
          <View
            style={{ backgroundColor: "transparent" }}
            className="flex flex-row justify-between items-center"
          >
            <Text className="dark:text-white text-lg font-semibold">
              {!isNew ? (
                <Octicons
                  name="pencil"
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              ) : (
                "New Category"
              )}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setToggle(false);
              }}
              className="px-1 py-1"
            >
              <Ionicons
                name="close-sharp"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          </View>
          <View className="space-y-1 pb-3 pt-5">
            <Text className="dark:text-white text-lg font-semibold">
              Description
            </Text>
            <TextInput
              className="py-2 px-3 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="e.g shopping"
              placeholderTextColor="grey"
              value={payload.category}
              keyboardType="default"
              onChangeText={(category) => setPayload({ ...payload, category })}
            />
          </View>
          {isNew ? (
            <TouchableOpacity
              disabled={loading}
              onPress={() => Submit()}
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">Add Category</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={loading}
              onPress={() => Update()}
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">Edit Category</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </FadeInView>
  );
}
