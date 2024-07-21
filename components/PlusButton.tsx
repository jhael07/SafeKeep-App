import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

type PlusButton = {
  onPress: (event: GestureResponderEvent) => void;
};

const PlusButton = (props: PlusButton) => {
  return (
    <View style={style.optionsContainer}>
      <TouchableOpacity onPress={props.onPress}>
        <AntDesign name="pluscircle" size={44} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default PlusButton;

const style = StyleSheet.create({
  optionsContainer: {
    position: "absolute",
    bottom: 70,
    right: 20,
    alignSelf: "center",
    width: 360,
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 30,
    opacity: 0.8,
  },
});
