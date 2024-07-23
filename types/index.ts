import { Dispatch, ForwardedRef, SetStateAction } from "react";
import DatabaseOperations from "@/services/DatabaseOperations";
import BottomSheet from "@gorhom/bottom-sheet";

export type Incident = {
  id?: string;
  title: string;
  description: string;
  picture: string;
  audio: string;
};

export type TABLES = "incidents" | "incidentsTest";

export type IncidentForm = {
  title: string;
  description: string;
};

export type CreateIncidentBottomsheetRef = ForwardedRef<BottomSheet>;

export type CreateIncidentBottomsheetProps = {
  onClose?: () => void;
  imagePreview: string;
  handleOnPressImage: () => void;
  incidentForm: IncidentForm;
  setIncidentForm: Dispatch<SetStateAction<IncidentForm>>;
  handleKeyboardVisisble: () => void;
  dbOperations: DatabaseOperations<Incident>;
  imgFile?: FileAppWrite;
};

export type FileAppWrite = {
  name: string;
  type: string;
  size: number;
  uri: string;
};
