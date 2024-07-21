import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * ### NoIncidentsPlaceholder
 *
 * This component serves as a ```placeholder``` when there are no ```incidents``` created.
 * It displays an icon and a message encouraging the user to create an incident.
 *
 * @returns {React.JSX.Element} A React element representing the placeholder UI.
 */
const NoIncidentsPlaceholder = (): React.JSX.Element => {
  return (
    <View style={style.container}>
      <FontAwesome
        name="inbox"
        size={96}
        color={"darkgray"}
        style={{ opacity: 0.7 }}
      />
      <Text style={style.text}>
        No existe ningun incidente, presiona crear incidente.
      </Text>
    </View>
  );
};

export default NoIncidentsPlaceholder;

const style = StyleSheet.create({
  container: {
    marginTop: 140,
    gap: 14,
    alignSelf: "center",
    width: 360,
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    color: "lightgray",
    opacity: 0.7,
  },
});
