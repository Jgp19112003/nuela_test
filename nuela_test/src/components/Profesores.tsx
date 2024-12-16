import React, { useState, useEffect } from "react";
import ConfirmacionPopup from "./ConfirmacionPopup"; // Importamos el popup
import "../styles/Profesores.css";
import plusIcono from "../images/plus.png";
import { Profesor } from "../interfaces/Profesor";
import FormularioAgregarProfesor from "./FormularioAgregarProfesor";

export default function Profesores() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [profesorSeleccionado, setProfesorSeleccionado] =
    useState<Profesor | null>(null);
  const [profesorIdSeleccionado, setProfesorIdSeleccionado] = useState<
    number | null
  >(null); // Nuevo estado para manejar ID de eliminación

  useEffect(() => {
    // Cargar lista de profesores desde localStorage
    const profesoresGuardados = JSON.parse(
      localStorage.getItem("profesores") || "[]"
    );
    setProfesores(profesoresGuardados);
  }, []);

  const handleEliminarClick = (id: number) => {
    setProfesorIdSeleccionado(id); // Usamos el nuevo estado para manejar el ID
    setShowConfirmacion(true); // Mostramos el popup de confirmación
  };

  const handleConfirmarEliminar = () => {
    if (profesorIdSeleccionado !== null) {
      // Verificamos el nuevo estado
      const nuevosProfesores = profesores.filter(
        (profesor: Profesor) => profesor.id !== profesorIdSeleccionado
      );
      setProfesores(nuevosProfesores);
      localStorage.setItem("profesores", JSON.stringify(nuevosProfesores)); // Guardamos en localStorage
      setShowConfirmacion(false); // Cerramos el popup
      setProfesorIdSeleccionado(null); // Limpiamos el estado
    }
  };

  const handleAgregarProfesor = (profesor: Profesor) => {
    // Si no se proporciona un ID, calcular el ID basado en los profesores existentes
    const storedProfesores = JSON.parse(
      localStorage.getItem("profesores") || "[]"
    );

    // Calcular el ID del nuevo profesor
    const nuevoId =
      storedProfesores.length === 0
        ? 0
        : Math.max(
            ...storedProfesores.map((profesor: Profesor) => profesor.id)
          ) + 1;

    // Si el profesor no tiene ID, asignarle el nuevo ID calculado
    const nuevoProfesor = { ...profesor, id: profesor.id ?? nuevoId };

    // Verificar si el profesor ya existe por ID (en caso de actualización)
    const index = profesores.findIndex((p) => p.id === nuevoProfesor.id);
    let nuevosProfesores;
    if (index >= 0) {
      // Actualizar el profesor existente
      nuevosProfesores = [...profesores];
      nuevosProfesores[index] = nuevoProfesor;
    } else {
      // Agregar nuevo profesor
      nuevosProfesores = [...profesores, nuevoProfesor];
    }

    // Actualizar el estado y guardar en localStorage
    setProfesores(nuevosProfesores);
    localStorage.setItem("profesores", JSON.stringify(nuevosProfesores)); // Guardamos el nuevo profesor
    setShowFormulario(false); // Cerramos el formulario
  };

  const handleEditarProfesor = (profesor: Profesor) => {
    setProfesorSeleccionado(profesor); // Aquí seleccionamos el profesor
    setShowFormulario(true); // Mostramos el formulario con datos pre-rellenados
  };

  return (
    <div className="profesores">
      <div className="info-horarios">
        <div>
          <p className="text_Horarios">Profesores</p>
          <p className="text_Crea_Y_Gestiona">Gestiona tus profesores</p>
        </div>
        <hr className="linea-gris" />
        <button
          className="boton-añadir-profesor"
          onClick={() => {
            setShowFormulario(true);
            setProfesorSeleccionado(null);
          }}
        >
          <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
          <span>Añadir profesor</span>
        </button>
      </div>
      {profesores.length > 0 ? (
        profesores.map((profesor: Profesor) => (
          <div
            key={profesor.id}
            className="card-profesores"
            onClick={() => handleEditarProfesor(profesor)}
          >
            <label
              className="avatar"
              style={{ backgroundImage: `url(${profesor.logo})` }}
            ></label>
            <label className="info">
              <span className="info-1">{`${profesor.nombre} ${profesor.apellido} ${profesor.segundoApellido}`}</span>
              <span className="info-2">{profesor.telefono}</span>
              <a
                className="info-3 email-link"
                href={`mailto:${profesor.email}`}
              >
                {profesor.email}
              </a>
              <span className="info-4">{profesor.especialidad}</span>
            </label>
            <div className="boton-container-p">
              <button
                className="bin-button-p"
                onClick={(e) => {
                  e.stopPropagation(); // Para que no se active el evento de click en la tarjeta
                  setProfesorSeleccionado(profesor);
                  handleEliminarClick(profesor.id);
                }}
              >
                <svg className="bin-top-p" viewBox="0 0 39 7" fill="none">
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
                <svg className="bin-bottom-p" viewBox="0 0 33 39" fill="none">
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
            marginLeft: "678px",
            textAlign: "center",
          }}
        >
          No hay alumnos disponibles para mostrar.
        </p>
      )}

      {/* Popup de confirmación */}
      {showConfirmacion && (
        <ConfirmacionPopup
          mensaje={`¿Estás seguro de que deseas eliminar a ${
            profesorSeleccionado!!.nombre
          } ${profesorSeleccionado!!.apellido} ${
            profesorSeleccionado!!.segundoApellido
          }?`}
          onClose={() => {
            setShowConfirmacion(false);
            setProfesorSeleccionado(null);
          }}
          onConfirm={handleConfirmarEliminar}
        />
      )}

      {showFormulario && (
        <FormularioAgregarProfesor
          onClose={() => setShowFormulario(false)}
          onAgregarProfesor={handleAgregarProfesor}
          profesor={null}
        />
      )}

      {showFormulario && (
        <FormularioAgregarProfesor
          onClose={() => setShowFormulario(false)}
          onAgregarProfesor={handleAgregarProfesor}
          profesor={profesorSeleccionado} // Pasamos el profesor seleccionado si existe
        />
      )}
    </div>
  );
}
