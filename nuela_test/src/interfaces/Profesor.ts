import { Asignatura } from "./Asignatura";
import { Evento } from "./Evento";

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  segundoApellido: string;
  fechaNacimiento: string; // Podrías usar Date, pero para simplificar, usaremos string
  telefono: number;
  email: string;
  asignaturas: Asignatura[];
  eventos: Evento[];
  especialidad: string;
  evaluacion: number; // Podrías usar otro tipo según necesites
  logo: string;
}
