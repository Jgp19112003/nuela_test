import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import plusIcono from "../images/plus.png";
import { Espacio } from "../interfaces/Espacio";
import { Asignatura } from "../interfaces/Asignatura";
import { Profesor } from "../interfaces/Profesor";
import "../styles/Espacios.css";
import FormularioAgregarEspacio from "./FormularioAgregarEspacio";

export const Espacios = () => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  // Cargar datos de localStorage al montar el componente
  useEffect(() => {
    const espaciosStorage = localStorage.getItem("espacios");
    const asignaturasStorage = localStorage.getItem("asignaturas");
    const profesoresStorage = localStorage.getItem("profesores");

    if (espaciosStorage) {
      setEspacios(JSON.parse(espaciosStorage));
    }
    if (asignaturasStorage) {
      setAsignaturas(JSON.parse(asignaturasStorage));
    }
    if (profesoresStorage) {
      setProfesores(JSON.parse(profesoresStorage));
    }
  }, []);

  // Actualizar localStorage cuando la lista de espacios cambia
  useEffect(() => {
    localStorage.setItem("espacios", JSON.stringify(espacios));
  }, [espacios]);

  const [showModal, setShowModal] = useState(false);
  const [espacioEditando, setEspacioEditando] = useState<Espacio | null>(null);

  const handleAgregarEspacio = () => {
    setEspacioEditando(null);
    setShowModal(true);
  };

  const handleEditarEspacio = (espacio: Espacio) => {
    setEspacioEditando(espacio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAgregarOEditarEspacio = (nuevoEspacio: Espacio) => {
    if (espacioEditando) {
      // Si estamos editando, actualizamos el espacio existente
      setEspacios((prevEspacios) =>
        prevEspacios.map((espacio) =>
          espacio.curso === espacioEditando.curso ? nuevoEspacio : espacio
        )
      );
    } else {
      // Si estamos agregando, añadimos un nuevo espacio
      setEspacios((prevEspacios) => [...prevEspacios, nuevoEspacio]);
    }
    setShowModal(false);
  };

  const handleEliminarEspacio = (espacioCurso: string) => {
    setEspacios((prevEspacios) =>
      prevEspacios.filter((espacio) => espacio.curso !== espacioCurso)
    );
  };

  // Función para evitar asignaturas duplicadas
  const handleAgregarAsignatura = (
    espacio: Espacio,
    nuevaAsignatura: Asignatura
  ) => {
    const asignaturasExistentes = espacio.asignaturas;

    // Verificar si la asignatura ya existe
    if (
      !asignaturasExistentes.some(
        (asignatura) => asignatura.nombre === nuevaAsignatura.nombre
      )
    ) {
      const espacioActualizado = {
        ...espacio,
        asignaturas: [...espacio.asignaturas, nuevaAsignatura],
      };
      setEspacios((prevEspacios) =>
        prevEspacios.map((espacioItem) =>
          espacioItem.curso === espacio.curso ? espacioActualizado : espacioItem
        )
      );
    } else {
      alert("La asignatura ya está asignada a este espacio.");
    }
  };

  return (
    <div className="inicio">
      <div className="info-profesor">
        <div>
          <p className="text_Profesores">Espacios</p>
          <p className="text_Crea_Y_Gestiona">
            Gestiona los espacios de tu centro
          </p>
        </div>
        <hr className="linea-gris" />
        <div className="boton-container-espacio">
          <button
            className="boton-añadir-espacio"
            onClick={handleAgregarEspacio}
          >
            <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
            <span>Añadir Espacio</span>
          </button>
        </div>
        <Table bordered className="mi-tabla">
          <thead>
            <tr>
              <th className="thStart">Curso</th>
              <th>Grupos</th>
              <th>Asignaturas</th>
              <th>Profesores</th>
              <th>Alumnos</th>
              <th className="thFinal">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {espacios.map((espacio, index) => (
              <tr key={index}>
                <td>{espacio.curso}</td>
                <td>{espacio.grupos.join(", ")}</td>
                <td>
                  {(() => {
                    // Filtramos y utilizamos una lógica basada en pop si es necesario
                    espacio.asignaturas = espacio.asignaturas.filter(
                      (asignatura, idx, arr) => {
                        // Si profesorId es null, verificar si hay otra asignatura con el mismo nombre y profesorId no null
                        if (asignatura.profesorId === null) {
                          const hasOther = arr.some(
                            (otherAsignatura) =>
                              otherAsignatura.nombre === asignatura.nombre &&
                              otherAsignatura.profesorId !== null
                          );

                          // Si hay otra asignatura con el mismo nombre y profesorId no null, la eliminamos usando pop
                          if (hasOther) {
                            arr.filter((_, i) => i !== index); // Elimina el último elemento del array
                            return false; // No incluir esta asignatura en el filtrado
                          }
                        }
                        return true; // Mantener asignaturas con profesorId no nulo o sin coincidencias
                      }
                    );

                    // Mapeamos las asignaturas ya filtradas para la visualización
                    return espacio.asignaturas.map((asignatura, idx) => (
                      <span key={asignatura.profesorId || idx}>
                        {asignatura.nombre}
                        {idx < espacio.asignaturas.length - 1 && <br />}
                      </span>
                    ));
                  })()}
                </td>

                <td>
                  {espacio.asignaturas.map((asignatura, idx) => {
                    // Buscar el profesor correspondiente a la asignatura
                    const profesor = profesores.find(
                      (prof) => prof.id === asignatura.profesorId
                    );

                    return (
                      <div key={idx}>
                        {profesor
                          ? `${profesor.nombre} ${profesor.apellido} ${profesor.segundoApellido}`
                          : " "}
                      </div>
                    );
                  })}
                </td>
                <td>{espacio.alumnos}</td>
                <td>
                  <Button
                    variant="light"
                    className="btn-editar"
                    onClick={() => handleEditarEspacio(espacio)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="light"
                    className="btn-eliminar"
                    onClick={() => handleEliminarEspacio(espacio.curso)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para agregar/editar espacio */}
      {showModal && (
        <FormularioAgregarEspacio
          onClose={handleCloseModal}
          onAgregarespacio={handleAgregarOEditarEspacio}
          espacio={espacioEditando}
          listaAsignaturas={asignaturas}
          listaProfesores={profesores}
        />
      )}
    </div>
  );
};
