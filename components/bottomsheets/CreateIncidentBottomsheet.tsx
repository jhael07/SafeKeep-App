import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import React, { forwardRef, useEffect, useState } from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import Colors from "@/constants/Colors";

import {
  CreateIncidentBottomsheetProps,
  CreateIncidentBottomsheetRef,
  FileAppWrite,
} from "@/types";

import { randomUUID } from "expo-crypto";

import { Client, ID, Storage } from "react-native-appwrite";
import { Audio } from "expo-av";

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const client = new Client(); // Init your React Native SDK

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_PROJECT_ID)
    .setPlatform("com.jehlicot.appvigilancia"); // Your application ID or bundle ID.

  const storage = new Storage(client);

  const AddImageToRemoteStorage = async (img: FileAppWrite) => {
    try {
      const imgPromise = await storage.createFile(
        process.env.EXPO_PUBLIC_BUCKET_ID,
        ID.unique(),
        img
      );

      return imgPromise;
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOnChange = (name: "title" | "description", txt: any) =>
    setIncidentForm((prev) => ({ ...prev, [name]: txt }));

  useEffect(() => {
    Keyboard.addListener("keyboardDidHide", (e) => handleKeyboardVisisble());
    return () => Keyboard.removeAllListeners("keyboardDidHide");
  }, []);

  const [recording, setRecording] = useState<Audio.Recording | undefined>(
    undefined
  );
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState<any>();
  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    if (uri) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      await sound.playAsync();
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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

        {!recording ? (
          <TouchableOpacity
            onPress={() => {
              startRecording();
              console.log(recording);
            }}
            style={[
              style.uploadBtn,
              { height: 70, backgroundColor: Colors.primary },
            ]}
          >
            <Text style={{ color: "white" }}>Grabar Audio</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              stopRecording();
              console.log(recording);
            }}
            style={[style.uploadBtn, { height: 70 }]}
          >
            <Text style={{ color: "white" }}>Parar Grabacion</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={async () => {
            try {
              setIsLoading(true);
              // dbOperations.create(
              //   "incidents",
              //   ["id", "title", "description", "picture", "audio"],
              //   [randomUUID(), incidentForm.title, incidentForm.description]
              // );

              if (imgFile) await AddImageToRemoteStorage(imgFile);
            } catch (err: any) {
              alert(err.message);
            } finally {
              setIsLoading(false);
            }
          }}
          style={[style.uploadBtn, style.saveButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} size={"large"} />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              Guardar
            </Text>
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
});
