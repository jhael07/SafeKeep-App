import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { ElementType, useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Incident } from "@/types";
import { Audio } from "expo-av";
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
  const { getFileById } = AppWrite.Storage();

  const sound = useRef<Audio.Sound>(new Audio.Sound());
  const timer = useRef<any>();

  const [isLoading, setIsLoading] = useState(false);
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

      if (status.isLoaded && !status.isPlaying) clearTimeout(timer.current);
    });
  }, [isPlaying]);

  const playAudio = async (fileId: string) => {
    try {
      if (isPlaying) {
        sound.current.pauseAsync();
        setIsPlaying(false);
      } else {
        const uri = await getFileById(fileId);

        if (uri) {
          if (!sound.current._loaded) {
            setIsLoading(true);
            await sound.current.loadAsync({ uri });
          }
          setIsLoading(false);
          await sound.current.playAsync();
          setIsPlaying(true);
        }
      }
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
      <TouchableOpacity
        disabled={isLoading}
        onPress={async () => playAudio(incident?.audio ?? "")}
        style={style.audio}
      >
        {isPlaying ? (
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
