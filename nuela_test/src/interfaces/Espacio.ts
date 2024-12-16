import { Asignatura } from "./Asignatura";
import { Profesor } from "./Profesor";

export interface Espacio {
  curso: string;
  grupos: string[];
  asignaturas: Asignatura[];
  profesores: Profesor[];
  alumnos: number;
}
