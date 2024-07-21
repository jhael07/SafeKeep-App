export type Incident = {
  id?: number;
  title: string;
  description: string;
  picture: string;
  audio: string;
};

export type TABLES = "incidents";

export type IncidentForm = {
  title: string;
  description: string;
};
