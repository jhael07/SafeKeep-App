import Colors from "@/constants/Colors";
import React from "react";
import { ElementType } from "react";

export const TabsOption = (
  Icon: ElementType,
  name: string,
  size?: number
): Record<string, any> => ({
  title: "",
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <Icon
      name={name}
      size={size ?? 24}
      color={focused ? Colors.primary : "white"}
    />
  ),
});
