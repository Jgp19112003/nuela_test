import React, { useEffect, useState } from "react";
import "../styles/Horarios.css";
import imgMM from "../images/MM.png";
import flecha from "../images/flecha-icono.png";
import plusIcono from "../images/plus.png";
import Popup from "./Popup";
import { Profesor } from "../interfaces/Profesor";
import FormularioAgregarHorario from "./FormularioAgregarHorario";
import { Asignatura } from "../interfaces/Asignatura";
import CalendarApp from "./CalendarApp";
import { Evento } from "../interfaces/Evento";
import ConfirmacionPopup from "./ConfirmacionPopup";

// Define la estructura de cada evento
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

const Horarios = () => {
  const [profesores, setProfesores] = useState<Profesor[]>(() => {
    const storedProfesores = localStorage.getItem("profesores");
    return JSON.parse(storedProfesores || "[]");
  });
  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState<boolean>(false);
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [mostrarPopup, setMostrarPopup] = useState<boolean>(false);
  const [profesorSeleccionado, setProfesorSeleccionado] =
    useState<Profesor | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const diasSemana = [
    "Hora/Día",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
  ];
  const horas = [
    "8:00 - 9:00",
    "9:00 - 10:00",
    "10:00 - 11:00",
    "DESCANSO",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
  ];

  const mostrarFormularioAgregarHorario = () => {
    setMostrarFormulario(true);
  };

  const cerrarFormularioAgregarHorario = () => {
    setMostrarFormulario(false);
  };

  useEffect(() => {
    localStorage.setItem("profesores", JSON.stringify(profesores));
  }, [profesores]);

  useEffect(() => {
    if (profesorSeleccionado) {
      localStorage.setItem(
        "profesorSeleccionado",
        JSON.stringify(profesorSeleccionado)
      );
    }
  }, [profesorSeleccionado]);

  useEffect(() => {
    const profesorGuardado = localStorage.getItem("profesorSeleccionado");
    if (profesorGuardado) {
      const profesor = JSON.parse(profesorGuardado);
      setProfesorSeleccionado(
        profesores.find((p) => p.id === profesor.id) || null
      );
    }
  }, [profesores]);

  // Nuevo useEffect para cargar eventos del profesor seleccionado
  useEffect(() => {
    if (profesorSeleccionado && profesorSeleccionado.eventos) {
      // Asegúrate de que los eventos están en el formato adecuado para CalendarApp
      console.log(profesorSeleccionado);

      const eventosDelProfesor = profesorSeleccionado.eventos.map((evento) => ({
        id: evento.id,
        title: evento.title,
        start: evento.start,
        end: evento.end,
      }));
      console.log(eventosDelProfesor);

      setEventos(eventosDelProfesor);
    }
  }, [profesorSeleccionado]);

  const generarEventosRecurrentes = (
    dia: string,
    hora: string,
    asignatura: Asignatura,
    eventos: Evento[]
  ) => {
    // Ajustar los índices para que coincidan con los valores de Date.getDay() (0: Domingo, 1: Lunes, ...)
    const diasSemanaIndices: { [key: string]: number } = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    const diaIndice = diasSemanaIndices[dia];
    if (diaIndice === undefined) {
      console.error("Día de la semana no válido:", dia);
      return;
    }

    // Obtener hora de inicio en formato "HH:MM"
    const startHour = hora.split(" - ")[0];
    const eventosRecurrentes: CalendarEvent[] = [];
    let currentId = eventos.length + 1;

    const formatFecha = (fecha: Date) => {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      const hours = String(fecha.getHours()).padStart(2, "0");
      const minutes = String(fecha.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // Inicializar el primer día del año
    let start = new Date(`2024-01-01 ${startHour}:00`);
    if (isNaN(start.getTime())) {
      console.error("Fecha de inicio inválida", { start });
      return;
    }

    // Buscar el primer día que coincida con el seleccionado
    while (start.getDay() !== diaIndice) {
      start.setDate(start.getDate() + 1);
    }

    while (start.getFullYear() === 2024) {
      // Crear la fecha de fin, una hora después de la fecha de inicio
      const end = new Date(start.getTime() + 1 * 60 * 60 * 1000);

      eventosRecurrentes.push({
        id: currentId.toString(),
        title: asignatura.nombre,
        start: formatFecha(start),
        end: formatFecha(end),
      });
      currentId++;

      // Incrementar en una semana para ir al mismo día de la semana siguiente
      start.setDate(start.getDate() + 7);
    }

    console.log(eventosRecurrentes);

    return eventosRecurrentes; // Devuelve el array de eventos generados
  };

  const agregarHorario = (
    dia: string,
    hora: string,
    asignatura: Asignatura,
    profesorId: number
  ) => {
    // Genera los eventos recurrentes y los asigna temporalmente en una variable
    const nuevosEventos = generarEventosRecurrentes(
      dia,
      hora,
      asignatura,
      profesorSeleccionado!!.eventos
    );

    // Agrega los eventos generados al calendario actual
    setEventos((prevEventos) => [...prevEventos, ...nuevosEventos!!]);

    if (profesorSeleccionado) {
      // Actualiza los eventos del profesor seleccionado en el estado
      const profesorActualizado = {
        ...profesorSeleccionado,
        eventos: [...profesorSeleccionado.eventos, ...nuevosEventos!!],
      };

      setProfesorSeleccionado(profesorActualizado);

      // Actualiza la lista de profesores en el estado
      const profesoresActualizados = profesores.map((prof) =>
        prof.id === profesorId ? profesorActualizado : prof
      );

      setProfesores(profesoresActualizados);

      // Actualiza el almacenamiento local con la lista de profesores actualizada
      localStorage.setItem(
        "profesores",
        JSON.stringify(profesoresActualizados)
      );

      // Actualiza el almacenamiento local del profesor seleccionado
      localStorage.setItem(
        "profesorSeleccionado",
        JSON.stringify(profesorActualizado)
      );
    }

    // Cierra el formulario de agregar horario
    cerrarFormularioAgregarHorario();
  };

  const eliminarEventos = () => {
    setEventos([]); // Elimina todos los eventos
    if (profesorSeleccionado) {
      const profesorActualizado = {
        ...profesorSeleccionado,
        eventos: [], // Elimina los eventos del profesor
      };
      setProfesorSeleccionado(profesorActualizado);
      // Actualiza el almacenamiento local
      const profesoresActualizados = profesores.map((prof) =>
        prof.id === profesorSeleccionado.id ? profesorActualizado : prof
      );
      setProfesores(profesoresActualizados);
      localStorage.setItem(
        "profesores",
        JSON.stringify(profesoresActualizados)
      );
      localStorage.setItem(
        "profesorSeleccionado",
        JSON.stringify(profesorActualizado)
      );
    }
    setMostrarConfirmacion(false); // Cierra el popup de confirmación
  };

  return (
    <div className="horarios">
      <div className="info-horarios">
        <div>
          <p className="text_Horarios">Horarios</p>
          <p className="text_Crea_Y_Gestiona">
            Echa un vistazo a los horarios de tus profesores
          </p>
        </div>

        <hr className="linea-gris" />

        <button
          className="button-dropdown"
          onClick={() => setMostrarPopup(true)}
        >
          <img src={flecha} alt="flecha" className="flecha" />
        </button>

        <div className="parrafosInfo">
          <div className="profesor-img">
            <img src={imgMM} alt="Profesor logo" className="profesor-logo" />
          </div>
          <div className="parrafos-contenedor">
            <p className="profesor-nombre">
              {profesorSeleccionado?.nombre} {profesorSeleccionado?.apellido}{" "}
              {profesorSeleccionado?.segundoApellido}
            </p>
            <a
              className="email-link"
              href={`mailto:${profesorSeleccionado?.email}`}
            >
              {profesorSeleccionado?.email}
            </a>
            <p className="tlf">{profesorSeleccionado?.telefono}</p>
          </div>
        </div>

        <hr className="linea-gris" />

        <div className="boton-container">
          <button
            className="bin-button"
            onClick={() => setMostrarConfirmacion(true)}
          >
            <svg className="bin-top" viewBox="0 0 39 7" fill="none">
              <line
                y1="5"
                x2="39"
                y2="5"
                stroke="white"
                stroke-width="4"
              ></line>
              <line
                x1="12"
                y1="1.5"
                x2="26.0357"
                y2="1.5"
                stroke="white"
                stroke-width="3"
              ></line>
            </svg>
            <svg className="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                fill="white"
                mask="url(#path-1-inside-1_8_19)"
              ></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>

          <button
            className="boton-añadir-horario"
            onClick={mostrarFormularioAgregarHorario}
          >
            <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
            <span>Añadir Evento</span>
          </button>

          {mostrarConfirmacion && (
            <ConfirmacionPopup
              mensaje="¿Estás seguro de que deseas eliminar todos los eventos?"
              onConfirm={eliminarEventos} // Función que se ejecutará al confirmar
              onClose={() => setMostrarConfirmacion(false)} // Cierra el popup
            />
          )}
        </div>

        {mostrarFormulario && profesorSeleccionado && (
          <FormularioAgregarHorario
            onClose={cerrarFormularioAgregarHorario}
            onAgregarHorario={agregarHorario}
            profesorId={profesorSeleccionado.id}
            asignaturas={profesorSeleccionado.asignaturas}
          />
        )}

        {mostrarPopup && (
          <Popup
            profesores={profesores}
            onProfesorSelect={(profesor: Profesor) => {
              setProfesorSeleccionado(profesor);
              setMostrarPopup(false);
            }}
            onClose={() => setMostrarPopup(false)}
          />
        )}
      </div>

      <CalendarApp eventos={eventos} />
    </div>
  );
};

export default Horarios;
