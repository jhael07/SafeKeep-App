import React from "react";
import { Tabs } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { TabsOption } from "@/utils/screensUtils";
import Colors from "@/constants/Colors";

const _layout = () => {
  const TabsScreenOptions: Record<string, any> = {
    headerShown: false,
    tabBarIconStyle: {
      backgroundColor: "white",
      marginBottom: -14,
    },
    tabBarStyle: {
      backgroundColor: Colors["bg-3"],
      borderColor: "transparent",
      height: 60,
    },
    tabBarHideOnKeyboard: true,
  };

  return (
    <Tabs screenOptions={{ ...TabsScreenOptions }}>
      <Tabs.Screen name="index" options={TabsOption(Feather, "clipboard")} />
      <Tabs.Screen
        name="about"
        options={TabsOption(AntDesign, "infocirlceo")}
      />
    </Tabs>
  );
};

export default _layout;
