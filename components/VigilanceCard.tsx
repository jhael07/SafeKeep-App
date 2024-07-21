import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Incident } from "@/types";

const VigilanceCard = ({ incident }: { incident: Incident }) => {
  return (
    <View style={style.card}>
      <Image
        height={160}
        width={360}
        style={{ borderRadius: 8, alignSelf: "center" }}
        source={{
          uri: "https://www.insights.com/media/1042/placeholder2.jpg",
        }}
      />
      <Text
        style={{
          color: Colors.primary,
          fontSize: 18,
          fontWeight: "800",
          opacity: 0.9,
        }}
      >
        {incident.title}
      </Text>

      <Text style={{ color: "white", lineHeight: 22, marginBottom: 8 }}>
        {incident.description}
      </Text>

      <TouchableOpacity
        style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
      >
        <Ionicons name="play-circle" size={44} color={Colors.primary} />
        <Text style={{ color: "white" }}>Reproducir el audio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VigilanceCard;

const style = StyleSheet.create({
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
