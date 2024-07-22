import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { randomUUID } from "expo-crypto";
import { FileAppWrite } from "@/types";

const useRecording = () => {
  const [isRecording, setIsRecording] = useState<Audio.Recording>();
  const [audioFile, setAudioFile] = useState<FileAppWrite>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState<Audio.Sound>();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") await requestPermission();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setIsRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setIsRecording(undefined);
    await isRecording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = isRecording?.getURI();

    if (uri) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      const { size } = (await FileSystem.getInfoAsync(uri)) as any;
      const data = {
        name: `audio-${randomUUID()}.m4a`,
        size,
        type: "audio/mp4",
        uri,
      };

      setAudioFile(data);
      setSound(sound);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return { startRecording, stopRecording, isRecording, audioFile };
};

export default useRecording;
