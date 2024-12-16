import { Asignatura } from "./Asignatura";
import { Espacio } from "./Espacio";

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  telefonoTutor: number;
  email: string;
  asignaturas: Asignatura[];
  notas: number[];
  espacio: Espacio;
  grupo: string;
  evaluacion: number;
  logo: string;
}
