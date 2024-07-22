import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Incident } from "@/types";
import { Audio, AVPlaybackStatus } from "expo-av";
import AppWrite from "@/services/AppWrite";

/**
 * ### IncidentCard
 *
 * This component displays all the information about a previously saved ```incident```.
 * It includes the incident's title, description, image, and an option to play audio.
 *
 * @param {Incident} incident - Object with the incident's information such as the id, title, description, image, and audio.
 * @returns {React.JSX.Element} A React element representing the incident card UI.
 */
const IncidentCard = ({ incident }: { incident: Incident }): React.JSX.Element => {
  const { getFileCustom } = AppWrite.Storage();

  const soundObj = useRef<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    try {
      const uri = await getFileCustom();
      if (uri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { progressUpdateIntervalMillis: 100 },
          (status: any) => {
            if (status.isPlaying) {
              alert("isPlaying");
            } else {
              alert("isnotPlaying");
            }
          }
        );

        if (sound) {
          soundObj.current = sound;
          await soundObj.current?.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // useEffect(() => {
  // sound._callOnPlaybackStatusUpdateForNewStatus((av)=>{

  // }, [])

  // let playBackStatus: AVPlaybackStatus = {} as any;

  // useEffect(() => {
  //   (async () => {
  //     if (soundObj.current) {
  //       soundObj.current.setOnPlaybackStatusUpdate(async (status) => {
  //         playBackStatus = status;
  //         const audioStatus = await  soundObj.current?.getStatusAsync();
  //         console.log(audioStatus);
  //       });
  //     }
  //   })();
  // }, [ soundObj.current]);

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
      <TouchableOpacity
        onPress={
          !isPlaying
            ? playAudio
            : async () => {
                if (soundObj.current) {
                  soundObj.current?.pauseAsync();
                  setIsPlaying(false);
                }
              }
        }
        style={style.audio}
      >
        {isPlaying ? (
          <>
            <MaterialIcons name="stop-circle" size={44} color={Colors.primary} />
            <Text style={{ color: "white" }}>Pausar audio</Text>
          </>
        ) : (
          <>
            <Ionicons name="play-circle" size={44} color={Colors.primary} />
            <Text style={{ color: "white" }}>Reproducir el audio</Text>
          </>
        )}
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
