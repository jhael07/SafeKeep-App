import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { Incident } from "@/types";
import { Audio } from "expo-av";

export type Context = {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  incidentId: string;
  setIncidentId: React.Dispatch<React.SetStateAction<string>>;
  sound: React.MutableRefObject<Audio.Sound>;
  playingItem: PlayingItem;
  setPlayingItem: Dispatch<SetStateAction<PlayingItem>>;
};

type PlayingItem = Incident & { isPlaying: boolean };
const context = createContext<Context | any>(null);

const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [playingItem, setPlayingItem] = useState<PlayingItem>();
  const [incidentId, setIncidentId] = useState("");
  const sound = useRef<Audio.Sound>(new Audio.Sound());

  return (
    <context.Provider
      value={{
        incidents,
        setIncidents,
        incidentId,
        setIncidentId,
        sound,
        playingItem,
        setPlayingItem,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ContentProvider;

export const useContextProvider = () => useContext<Context>(context);
