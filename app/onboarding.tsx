import { Text, View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 40 }}>ONBOARDING</Text>
    </View>
  );
}
