import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
const IncidentCard = ({
  incident,
}: {
  incident: Incident;
}): React.JSX.Element => {
  const { getFileCustom } = AppWrite.Storage();

  const sound = useRef<Audio.Sound>(new Audio.Sound());
  const timer = useRef<any>();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    sound.current.getStatusAsync().then(async (status: any) => {
      if (status.isLoaded && status.positionMillis === status.durationMillis)
        await sound.current.unloadAsync();

      if (status.isPlaying) {
        timer.current = setTimeout(
          async () => {
            setIsPlaying(false);
            await sound.current.unloadAsync();
          },
          status.positionMillis === 0
            ? status.durationMillis
            : status.durationMillis - status.positionMillis
        );
      }

      if (status.isLoaded && !status.isPlaying) {
        clearTimeout(timer.current);
      }
    });
  }, [isPlaying]);

  const playAudio = async () => {
    try {
      if (isPlaying) {
        sound.current.pauseAsync();
        setIsPlaying(false);
      } else {
        // const status = (await sound.current.getStatusAsync()) as any;

        const uri = await getFileCustom();

        if (uri) {
          if (!sound.current._loaded) {
            await sound.current.loadAsync({ uri });
          }

          await sound.current.playAsync();
          setIsPlaying(true);
        }
      }

      // if ((await sound.current?.getStatusAsync())?.isLoaded) {
      //   if ((sound.current as any)?.isPlaying === false) {
      //     sound.current?.playAsync();
      //     setIsPlaying(true);
      //   } else {
      //     sound.current?.stopAsync();
      //     setIsPlaying(true);
      //   }
      // }
      // if (uri) {
      //   const { sound: soundObj } = await Audio.Sound.createAsync(
      //     { uri },
      //     { progressUpdateIntervalMillis: 100 },
      //     (status: any) => {
      //       if (status.isPlaying) {
      //         setIsPlaying(true);
      //       } else {
      //         setIsPlaying(false);
      //       }
      //     },
      //     true
      //   );
      //   sound.current = soundObj;
      //   await sound.current?.playAsync();

      //   setIsPlaying(true);
      // }
      // await sound.current.unloadAsync();
    } catch (err: any) {
      alert(err.message);
    } finally {
    }
  };

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
      <TouchableOpacity onPress={playAudio} style={style.audio}>
        {isPlaying ? (
          <>
            <MaterialIcons
              name="stop-circle"
              size={44}
              color={Colors.primary}
            />
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
