import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#020617",
        borderTopWidth: 0
      },
      tabBarActiveTintColor: "#22c55e"
    }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="control" options={{ title: "Control" }} />
    </Tabs>
  );
}