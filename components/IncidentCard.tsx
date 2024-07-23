import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { ElementType, useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Incident } from "@/types";
import { Audio } from "expo-av";
import AppWrite from "@/services/AppWrite";
import { useContextProvider } from "@/context/ContextProvider";

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
  const { getFileById } = AppWrite.Storage();
  const { incidentId, sound, playingItem, setPlayingItem } = useContextProvider();

  const timer = useRef<NodeJS.Timeout>();
  // let timer: NodeJS.Timeout | undefined = undefined;

  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = () => {
    timer.current = setInterval(async () => {
      sound.current.getStatusAsync().then(async (value: any) => {
        if (value.positionMillis === value.durationMillis) {
          setPlayingItem({ ...incident, isPlaying: false });
          clearInterval(timer.current);
        }
      });
    }, 500);
  };

  const playAudio = async (fileId: string) => {
    try {
      // if (!playingItem && !sound.current._loaded) {
      //   setIsLoading(true);
      //   if (uri) await sound.current.loadAsync({ uri });
      //   setIsLoading(false);
      //   await sound.current.playAsync();
      //   setPlayingItem({ ...incident, isPlaying: true });
      //   checkStatus();
      // }

      if (playingItem?.id === incident?.id) {
        if (playingItem.isPlaying) {
          setPlayingItem({ ...incident, isPlaying: false });
          await sound.current.pauseAsync();
        } else {
          setPlayingItem({ ...incident, isPlaying: true });
          await sound.current.playAsync();
          checkStatus();
        }
        return;
      }

      const uri = await getFileById(fileId);

      await sound.current.unloadAsync();
      setIsLoading(true);
      if (uri) await sound.current.loadAsync({ uri });
      setIsLoading(false);
      setPlayingItem({ ...incident, isPlaying: true });
      await sound.current.playAsync();
      checkStatus();
    } catch (err: any) {
      alert(err.message);
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
      <Text style={style.title}>{incidentId}</Text>
      <Text style={style.title}>{incident.title}</Text>
      <Text style={style.description}>{incident.description}</Text>
      <TouchableOpacity
        disabled={isLoading}
        onPress={async () => playAudio(incident?.audio ?? "")}
        style={style.audio}
      >
        {playingItem?.id === incident?.id && playingItem.isPlaying ? (
          <AudioAction
            isLoading={isLoading}
            Icon={MaterialIcons}
            iconName="stop-circle"
            description={"Pausar audio"}
          />
        ) : (
          <AudioAction
            isLoading={isLoading}
            Icon={Ionicons}
            iconName="play-circle"
            description={"Reproducir el audio"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default IncidentCard;

const AudioAction = (props: {
  Icon: ElementType;
  iconName: string;
  description: string;
  isLoading?: boolean;
}) => {
  const { Icon, iconName, description, isLoading } = props;
  return (
    <>
      {isLoading ? (
        <>
          <ActivityIndicator size={40} color={Colors.primary} />
          <Text style={{ color: "white" }}>Descargando audio...</Text>
        </>
      ) : (
        <>
          <Icon name={iconName} size={44} color={Colors.primary} />
          <Text style={{ color: "white" }}>{description}</Text>
        </>
      )}
    </>
  );
};

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
