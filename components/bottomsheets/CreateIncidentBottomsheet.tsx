import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";

import React, {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useEffect,
} from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import Colors from "@/constants/Colors";
import { Incident, IncidentForm } from "@/types";
import DatabaseOperations from "@/services/DatabaseOperations";

import { randomUUID } from "expo-crypto";

type Ref = ForwardedRef<BottomSheet>;

type Props = {
  onClose?: () => void;
  imagePreview: string;
  handleOnPressImage: () => void;
  incidentForm: IncidentForm;
  setIncidentForm: Dispatch<SetStateAction<IncidentForm>>;
  handleKeyboardVisisble: () => void;
  dbOperations: DatabaseOperations<Incident>;
};

const CreateIncidentBottomsheet = forwardRef<Ref, Props>((props, ref) => {
  const {
    handleOnPressImage,
    imagePreview,
    onClose,
    incidentForm,
    setIncidentForm,
    handleKeyboardVisisble,
    dbOperations,
  } = props;

  const handleOnChange = (name: "title" | "description", txt: any) =>
    setIncidentForm((prev) => ({ ...prev, [name]: txt }));

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
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
      )}
    >
      <View style={{ width: 380, alignSelf: "center", gap: 24 }}>
        <TouchableOpacity onPress={handleOnPressImage} style={style.uploadBtn}>
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

        <TouchableOpacity style={[style.uploadBtn, { height: 70 }]}>
          <Text style={{ color: "white" }}>Subir Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // dbOperations.create(
            //   "incidents",
            //   ["id", "title", "description", "picture", "audio"],
            //   [randomUUID(), incidentForm.title, incidentForm.description]
            // );
          }}
          style={[style.uploadBtn, style.saveButton]}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
            Guardar
          </Text>
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
});
