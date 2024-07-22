import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { CreateIncidentBottomsheetProps, CreateIncidentBottomsheetRef } from "@/types";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React, { forwardRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import Colors from "@/constants/Colors";
import AppWrite from "@/services/AppWrite";
import { randomUUID } from "expo-crypto";
import { object, string } from "yup";
import useRecording from "@/hooks/useRecording";
import { useContextProvider } from "@/context/ContextProvider";

type Ref = CreateIncidentBottomsheetRef;
type props = CreateIncidentBottomsheetProps;

const CreateIncidentBottomsheet = forwardRef<Ref, props>((props, ref) => {
  const {
    handleOnPressImage,
    imgFile,
    imagePreview,
    onClose,
    incidentForm,
    setIncidentForm,
    handleKeyboardVisisble,
    dbOperations,
  } = props;

  const { setIncidents } = useContextProvider();

  const { uploadFile } = AppWrite.Storage();
  const { startRecording, stopRecording, isRecording, audioFile } = useRecording();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formValidation = object({
    audio: string().required("El audio es requerido."),
    description: string().required("La descripción es requerida."),
    title: string().required("El titulo es requerido"),
    picture: string().required("La imagen es requerida."),
  });

  const handleOnChange = (name: "title" | "description", txt: any) =>
    setIncidentForm((prev) => ({ ...prev, [name]: txt }));

  const handleUploadIncident = async () => {
    let picture: string | undefined;
    let audio: string | undefined;

    try {
      setIsLoading(true);
      if (imgFile) picture = await uploadFile(imgFile);
      if (audioFile) audio = await uploadFile(audioFile);

      const formData = {
        id: randomUUID(),
        title: incidentForm.title,
        description: incidentForm.description,
        picture,
        audio,
      };

      await formValidation.validate(formData);
      await dbOperations.create(
        "incidentsTest",
        ["id", "title", "description", "picture", "audio"],
        [formData.id, incidentForm.title, incidentForm.description, picture, audio]
      );

      setIncidents((await dbOperations.getFromTable("incidentsTest")) ?? []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidHide", (e) => handleKeyboardVisisble());
    return () => Keyboard.removeAllListeners("keyboardDidHide");
  }, []);

  return (
    <BottomSheet
      enablePanDownToClose
      style={{ backgroundColor: Colors["bg-3"] }}
      handleIndicatorStyle={style.handleIndicatorStyle}
      backgroundStyle={{
        backgroundColor: Colors["bg-3"],
      }}
      onClose={onClose}
      snapPoints={["70%"]}
      index={-1}
      ref={ref as any}
      android_keyboardInputMode="adjustPan"
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />}
    >
      <View style={{ width: 380, alignSelf: "center", gap: 24 }}>
        <TouchableOpacity onPress={handleOnPressImage} style={style.uploadBtn}>
          {imagePreview.length > 0 ? (
            <Image height={140} width={380} source={{ uri: imagePreview }} resizeMode="cover" />
          ) : (
            <Text style={{ color: "white" }}>Subir Imagen</Text>
          )}
        </TouchableOpacity>

        <BottomSheetTextInput
          onChangeText={(text) => handleOnChange("title", text)}
          value={incidentForm.title}
          placeholderTextColor={"darkgray"}
          style={style.input}
          placeholder="Titulo"
        />
        <BottomSheetTextInput
          onChangeText={(text) => handleOnChange("description", text)}
          value={incidentForm.description}
          placeholder="Descripcion"
          placeholderTextColor={"darkgray"}
          style={style.input}
        />

        {!isRecording ? (
          <TouchableOpacity onPress={startRecording} style={[style.uploadBtn, style.audioBtn]}>
            <FontAwesome name="microphone" size={32} color="darkgray" />
            <Text style={{ color: "white" }}>Grabar Audio</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stopRecording}
            style={[style.uploadBtn, style.audioBtn, { gap: 12 }]}
          >
            <FontAwesome6 name="stop-circle" size={28} color={Colors.primary} />
            <Text style={{ color: Colors.primary }}>Parar Grabacion</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleUploadIncident}
          style={[style.uploadBtn, style.saveButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} size={"large"} />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

export default CreateIncidentBottomsheet;

const style = StyleSheet.create({
  saveButton: {
    height: 70,
    backgroundColor: Colors.primary,
    opacity: 0.7,
  },
  handleIndicatorStyle: {
    backgroundColor: Colors.primary,
    opacity: 0.6,
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

  audioBtn: { height: 70, flexDirection: "row", gap: 20 },
});
