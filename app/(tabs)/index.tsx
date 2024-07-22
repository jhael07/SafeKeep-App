import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";
import { FileAppWrite, Incident, IncidentForm } from "@/types";
import IncidentCard from "@/components/IncidentCard";
import BottomSheet from "@gorhom/bottom-sheet";
import DatabaseOperations from "@/services/DatabaseOperations";
import * as ImagePicker from "expo-image-picker";
import NoIncidentsPlaceholder from "@/components/NoIncidentsPlaceholder";
import PlusButton from "@/components/PlusButton";
import CreateIncidentBottomsheet from "@/components/bottomsheets/CreateIncidentBottomsheet";
import { randomUUID } from "expo-crypto";

const index = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<FileAppWrite>();

  const [incidentForm, setIncidentForm] = useState<IncidentForm>({
    title: "",
    description: "",
  });

  const db = useSQLiteContext();
  const operations = new DatabaseOperations<Incident>(db);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleKeyboardVisisble = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const openBottomsheet = () => {
    setIncidentForm({ title: "", description: "" });
    setImagePreview("");
    bottomSheetRef.current?.expand();
  };
  const closeBottomsheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleOnPressImage = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [10, 6],
    });

    if (!image.canceled) {
      const imageFromPicker = image.assets?.[0];

      const imageFile: FileAppWrite = {
        name: imageFromPicker.fileName ?? "",
        type: imageFromPicker.mimeType ?? "",
        size: imageFromPicker.fileSize ?? 0,
        uri: imageFromPicker.uri ?? "",
      };

      setImageFile(imageFile);
      setImagePreview(image.assets?.[0].uri ?? "");
    }
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
        {incidents.length === 0 ? <NoIncidentsPlaceholder /> : null}
        {incidents.map((item) => (
          <IncidentCard key={item.id} incident={item} />
        ))}
      </View>

      <PlusButton onPress={openBottomsheet} />

      <CreateIncidentBottomsheet
        imgFile={imageFile}
        dbOperations={operations}
        handleKeyboardVisisble={handleKeyboardVisisble}
        incidentForm={incidentForm}
        setIncidentForm={setIncidentForm}
        ref={bottomSheetRef as any}
        handleOnPressImage={handleOnPressImage}
        imagePreview={imagePreview}
        onClose={closeBottomsheet}
      />
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
});
