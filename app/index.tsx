import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={"large"}></ActivityIndicator>
    </View>
  );
}
