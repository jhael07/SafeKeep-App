import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";
import { Incident } from "@/types";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import VigilanceCard from "@/components/VigilanceCard";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import DatabaseOperations from "@/services/DatabaseOperations";
import * as ImagePicker from "expo-image-picker";

const index = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [incidentForm, setIncidentForm] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });

  const db = useSQLiteContext();
  const operations = new DatabaseOperations<Incident>(db);

  const bottomSheet = useRef<BottomSheet>();

  const openBottomsheet = () => bottomSheet.current?.expand();
  const closeBottomsheet = () => {
    setImagePreview("");
    bottomSheet.current?.close();
  };

  useEffect(() => {
    (async () => {
      operations.createTableQuery("incidents");
      setIncidents((await operations.getFromTable("incidents")) ?? []);
    })();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: Colors["bg-2"], flex: 1 }}>
      <Text style={style.screenTitle}>Todas las Incidencias</Text>

      <View style={{ width: 385, gap: 10, alignSelf: "center", marginTop: 30 }}>
        {incidents.length === 0 ? (
          <View
            style={{
              marginTop: 140,
              gap: 14,
              alignSelf: "center",
              width: 360,
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="inbox"
              size={96}
              color={"darkgray"}
              style={{ opacity: 0.7 }}
            />
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: "lightgray",
                opacity: 0.7,
              }}
            >
              No existe ningun incidente, presiona crear incidente.
            </Text>
          </View>
        ) : null}
        {incidents.map((item) => (
          <VigilanceCard key={item.id} incident={item} />
        ))}
      </View>

      <View style={style.optionsContainer}>
        <TouchableOpacity onPress={openBottomsheet}>
          <AntDesign name="pluscircle" size={44} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <BottomSheet
        enablePanDownToClose
        style={{ backgroundColor: Colors["bg-3"] }}
        handleIndicatorStyle={{
          backgroundColor: Colors.primary,
          opacity: 0.6,
        }}
        backgroundStyle={{
          backgroundColor: Colors["bg-3"],
        }}
        onClose={closeBottomsheet}
        snapPoints={["80%"]}
        index={-1}
        ref={bottomSheet as any}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
        )}
      >
        <View style={{ width: 380, alignSelf: "center", gap: 24 }}>
          <TouchableOpacity
            onPress={async () => {
              const image = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
                aspect: [10, 6],
              });

              if (!image.canceled) setImagePreview(image.assets?.[0].uri ?? "");
            }}
            style={style.uploadBtn}
          >
            {imagePreview.length > 0 ? (
              <Image
                height={140}
                width={380}
                source={{ uri: imagePreview }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ color: "white" }}>Subir Imagen</Text>
            )}
          </TouchableOpacity>

          <TextInput
            placeholderTextColor={"darkgray"}
            style={style.input}
            placeholder="Titulo"
          />
          <TextInput
            placeholder="Descripcion"
            placeholderTextColor={"darkgray"}
            style={style.input}
          />

          <TouchableOpacity style={[style.uploadBtn, { height: 70 }]}>
            <Text style={{ color: "white" }}>Subir Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.uploadBtn,
              {
                height: 70,
                backgroundColor: Colors.primary,
                opacity: 0.7,
                marginTop: 20,
              },
            ]}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              Guardar
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default index;

const style = StyleSheet.create({
  screenTitle: {
    color: Colors.primary,
    opacity: 0.7,
    fontSize: 24,
    fontWeight: "500",
    alignSelf: "center",
    marginTop: 20,
  },

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
  input: {
    borderRadius: 8,
    borderColor: Colors.primary,
    borderWidth: 0.2,
    padding: 12,
    backgroundColor: Colors["bg-2"],
    color: "white",
  },
  uploadBtn: {
    width: "100%",
    overflow: "hidden",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors["bg-2"],
    borderRadius: 14,
    height: 140,
    opacity: 0.9,
  },
});
