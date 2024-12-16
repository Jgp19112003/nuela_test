import React, { useState, useEffect } from "react";
import { Alumno } from "../interfaces/Alumno";
import FormularioAgregarAlumno from "./FormularioAgregarAlumno"; // Importa el formulario de alumnos
import "../styles/Alumnos.css";
import plusIcono from "../images/plus.png";

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alumnoSele, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [showFormulario, setShowFormulario] = useState(false);

  // Carga la lista de alumnos desde localStorage al montar el componente
  useEffect(() => {
    const storedAlumnos = localStorage.getItem("alumnos");
    if (storedAlumnos) {
      setAlumnos(JSON.parse(storedAlumnos));
    }
  }, []);

  // Guarda la lista de alumnos en localStorage cada vez que se actualiza
  useEffect(() => {
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
  }, [alumnos]);

  const handleEditarAlumno = (alumno: Alumno) => {
    setAlumnoSeleccionado(alumno);
    setShowFormulario(true);
  };

  const handleEliminarClick = (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este alumno?"
    );
    if (confirmDelete) {
      const nuevosAlumnos = alumnos.filter((alumno) => alumno.id !== id);
      setAlumnos(nuevosAlumnos);
    }
  };

  const handleCerrarFormulario = () => {
    setShowFormulario(false);
    setAlumnoSeleccionado(null);
  };

  const handleAgregarAlumno = (nuevoAlumno: Alumno) => {
    if (alumnoSele) {
      // Actualiza un alumno existente
      const alumnosActualizados = alumnos.map((alumno) =>
        alumno.id === nuevoAlumno.id ? nuevoAlumno : alumno
      );
      setAlumnos(alumnosActualizados);
    } else {
      // Agrega un nuevo alumno
      setAlumnos([...alumnos, nuevoAlumno]);
    }
    handleCerrarFormulario();
  };

  return (
    <div className="inicio">
      <div className="info-profesor">
        <div>
          <p className="text_Profesores">Alumnos</p>
          <p className="text_Crea_Y_Gestiona">Gestiona tus alumnos</p>
        </div>
        <hr className="linea-gris" />

        <button
          className="boton-añadir-profesor"
          onClick={() => {
            setShowFormulario(true);
            setAlumnoSeleccionado(null);
          }}
        >
          <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
          <span>Añadir Alumno</span>
        </button>
      </div>

      {/* Renderiza las tarjetas de alumnos */}
      <div className="lista-alumnos">
        {alumnos.length > 0 ? (
          alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="card-alumnos"
              onClick={() => handleEditarAlumno(alumno)}
            >
              <label
                className="avatar"
                style={{ backgroundImage: `url(${alumno.logo})` }}
              ></label>
              <label className="info">
                <span className="info-1">{`${alumno.nombre} ${alumno.apellido} ${alumno.segundoApellido}`}</span>
                <span className="info-2">{alumno.telefonoTutor}</span>
                <a
                  className="info-3 email-link"
                  href={`mailto:${alumno.email}`}
                >
                  {alumno.email}
                </a>
                <span className="info-4">
                  Nota media:{" " + alumno.evaluacion}
                </span>
              </label>
              <div className="boton-container-a">
                <button
                  className="bin-button-a"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita activar el evento de click en la tarjeta
                    setAlumnoSeleccionado(alumno);
                    handleEliminarClick(alumno.id);
                  }}
                >
                  {/* SVG bin icon */}
                  <svg className="bin-top-a" viewBox="0 0 39 7" fill="none">
                    <line
                      y1="5"
                      x2="39"
                      y2="5"
                      stroke="white"
                      strokeWidth="4"
                    ></line>
                    <line
                      x1="12"
                      y1="1.5"
                      x2="26.0357"
                      y2="1.5"
                      stroke="white"
                      strokeWidth="3"
                    ></line>
                  </svg>
                  <svg className="bin-bottom-a" viewBox="0 0 33 39" fill="none">
                    <mask id="path-1-inside-1_8_19" fill="white">
                      <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path
                      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                      fill="white"
                      mask="url(#path-1-inside-1_8_19)"
                    ></path>
                    <path d="M12 6L12 29" stroke="white" strokeWidth="4"></path>
                    <path d="M21 6V29" stroke="white" strokeWidth="4"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              textAlign: "center",
            }}
          >
            No hay alumnos disponibles para mostrar.
          </p>
        )}
      </div>

      {/* Muestra el formulario si showFormulario es true */}
      {showFormulario && (
        <FormularioAgregarAlumno
          onClose={handleCerrarFormulario}
          onAgregarAlumno={handleAgregarAlumno}
          alumno={alumnoSele}
        />
      )}
    </div>
  );
}
