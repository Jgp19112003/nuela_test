import { Profesor } from "./Profesor";

export interface PopupProps {
  profesores: Profesor[];
  onClose: () => void;
  onProfesorSelect: (profesor: Profesor) => void; // Nueva propiedad
}
