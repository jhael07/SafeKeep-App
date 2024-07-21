import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Incident } from "@/types";

/**
 * ### IncidentCard
 *
 * This component displays all the information about a previously saved ```incident```.
 * It includes the incident's title, description, image, and an option to play audio.
 *
 * @param {Incident} incident - Object with the incident's information such as the id, title, description, image, and audio.
 * @returns {React.JSX.Element} A React element representing the incident card UI.
 */
const IncidentCard = ({
  incident,
}: {
  incident: Incident;
}): React.JSX.Element => {
  return (
    <View style={style.card}>
      <Image
        height={160}
        width={360}
        style={{ borderRadius: 8, alignSelf: "center" }}
        source={{
          uri: incident.picture,
        }}
      />
      <Text style={style.title}>{incident.title}</Text>
      <Text style={style.description}>{incident.description}</Text>
      <TouchableOpacity style={style.audio}>
        <Ionicons name="play-circle" size={44} color={Colors.primary} />
        <Text style={{ color: "white" }}>Reproducir el audio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncidentCard;

const style = StyleSheet.create({
  audio: { flexDirection: "row", gap: 10, alignItems: "center" },

  description: { color: "white", lineHeight: 22, marginBottom: 8 },

  title: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "800",
    opacity: 0.9,
  },
  card: {
    width: "100%",
    padding: 16,
    paddingBottom: 20,
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: Colors.primary,
    backgroundColor: Colors["bg-3"],
    opacity: 0.8,
    gap: 8,
  },
});
