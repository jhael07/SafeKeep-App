import React, { createContext, ReactNode, useContext, useState } from "react";
import { Incident } from "@/types";

export type Context = {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
};

const context = createContext<Context | any>(null);

const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  return <context.Provider value={{ incidents, setIncidents }}>{children}</context.Provider>;
};

export default ContentProvider;

export const useContextProvider = () => useContext<Context>(context);
