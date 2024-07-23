import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text } from "react-native";

const Title = ({ title }: { title: string }) => {
  return <Text style={style.screenTitle}>{title}</Text>;
};

export default Title;

const style = StyleSheet.create({
  screenTitle: {
    color: Colors.primary,
    opacity: 0.7,
    fontSize: 24,
    fontWeight: "500",
    alignSelf: "center",
    marginTop: 20,
  },
});
