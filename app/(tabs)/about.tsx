import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import Title from "@/components/Title";
import React from "react";
import { Image, Text } from "react-native";

const about = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors["bg-2"] }}>
      <Title title="Creador" />

      <Image
        source={require("../../public/img/jhael.png")}
        style={{
          width: 250,
          height: 250,
          alignSelf: "center",
          marginTop: 20,
          borderRadius: 12,
        }}
      />

      <Text
        style={{
          color: Colors.primary,
          fontSize: 20,
          fontWeight: "600",
          alignSelf: "center",
          marginTop: 20,
          opacity: 0.8,
        }}
      >
        Jhael Rodriguez
      </Text>
      <Text
        style={{
          color: "darkgray",
          fontSize: 20,
          fontWeight: "600",
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        2022-0296
      </Text>

      <Text
        style={{
          color: "darkgray",
          fontSize: 16,
          marginTop: 40,
          width: 360,
          alignSelf: "center",
          textAlign: "justify",
          lineHeight: 24,
        }}
      >
        «El tiempo es lo que determina la seguridad. Con tiempo suficiente nada es inhackeable».-
        Aniekee Tochukwu Ezekiel.
      </Text>
    </SafeAreaView>
  );
};

export default about;
