import React, { useState, useEffect, useRef } from "react";
import { Card, Col, Row, Table, Button } from "react-bootstrap";
import "../styles/Inicio.css";
import imgMM from "../images/MM.png";
import flecha from "../images/flecha-icono.png";
import plusIcono from "../images/plus.png";
import FormularioAgregarAsignatura from "./FormularioAgregarAsignatura";
import { Asignatura } from "../interfaces/Asignatura";
import Popup from "./Popup";
import { Profesor } from "../interfaces/Profesor";

const Inicio = () => {
  // Declaraciones de estado
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [totalHoras, setTotalHoras] = useState(() => {
    const storedTotal = localStorage.getItem("totalHoras");
    return storedTotal ? JSON.parse(storedTotal) : 0; // Valor por defecto en 0 si no existe
  });
  const [emailUsuario] = useState<string>("");
  const [modoSemanal, setModoSemanal] = useState(() => {
    const storedModo = localStorage.getItem("modoSemanal");
    return storedModo ? JSON.parse(storedModo) : true; // Valor por defecto en true
  });
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(() => {
    const storedAsignaturas = localStorage.getItem("asignaturas");
    return storedAsignaturas ? JSON.parse(storedAsignaturas) : [];
  });

  const [espacios, setEspacios] = useState(() => {
    const storedEspacios = localStorage.getItem("espacios");
    return storedEspacios ? JSON.parse(storedEspacios) : []; // Valor por defecto en [] si no existe
  });
  const botonSemanalRef = useRef<HTMLButtonElement | null>(null);

  const [profesores, setProfesores] = useState<Profesor[]>(() => {
    const storedProfesores = localStorage.getItem("profesores");
    return storedProfesores ? JSON.parse(storedProfesores) : [];
  });
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(() => {
    const storedProfesor = localStorage.getItem("profesorSeleccionado");
    return storedProfesor ? JSON.parse(storedProfesor) : null; // Valor por defecto en null si no existe
  });

  const [mostrarPopup, setMostrarPopup] = useState<boolean>(false);

  // Definiciones de columnas para la tabla
  const columnas = [
    ["Matemáticas", "Física", "Química"],
    ["Obligatoria", "Optativa"],
    ["1º Bachillerato", "2º Bachillerato"],
    ["A", "B", "C"],
    ["3 h", "3,5 h", "4 h", "4,5 h", "5 h"],
    ["1º Bach - Grupo A", "1º Bach - Grupo B", "2º Bach - Grupo A"],
  ];

  useEffect(() => {
    localStorage.setItem("profesores", JSON.stringify(profesores)); // Guardar estado de profesores
  }, [profesores]);

  useEffect(() => {
    localStorage.setItem("modoSemanal", JSON.stringify(modoSemanal)); // Guardar estado del modo
  }, [modoSemanal]);

  // Efecto para recuperar profesorSeleccionado de localStorage
  useEffect(() => {
    const profesorGuardado = localStorage.getItem("profesorSeleccionado");
    if (profesorGuardado) {
      setProfesorSeleccionado(JSON.parse(profesorGuardado));
    }
  }, []);

  useEffect(() => {
    if (profesorSeleccionado) {
      calcularTotalHoras();
    }
  }, [profesorSeleccionado, asignaturas, modoSemanal]); // Dependencias actualizadas

  useEffect(() => {
    const storedTotal = localStorage.getItem("totalHoras");
    if (storedTotal) {
      setTotalHoras(JSON.parse(storedTotal));
    }
  }, []);

  // Funciones para calcular total de horas
  const calcularTotalHoras = () => {
    let total = 0;
    if (profesorSeleccionado) {
      profesorSeleccionado.asignaturas.forEach((asignatura: Asignatura) => {
        // Asegúrate de que la propiedad horaSemanal sea válida
        if (asignatura.horaSemanal) {
          total += parseFloat(asignatura.horaSemanal.replace(",", "."));
        }
      });

      if (modoSemanal) {
        total *= 52; // Multiplicar por 52 si está en modo anual
      }
    }
    setTotalHoras(total);
    // Guardar en localStorage
    localStorage.setItem("totalHoras", JSON.stringify(total));
  };

  // Funciones para manejar la visibilidad del formulario
  const mostrarFormularioAgregarAsignatura = () => {
    setMostrarFormulario(true);
  };

  const cerrarFormularioAgregarAsignatura = () => {
    setMostrarFormulario(false);
  };

  const handleAgregarAsignatura = (asignatura: Asignatura) => {
    // Actualizar el estado de asignaturas globalmente
    setAsignaturas((prevAsignaturas) => {
      const nuevasAsignaturas = [...prevAsignaturas, asignatura];

      // Guardar las nuevas asignaturas en localStorage
      localStorage.setItem("asignaturas", JSON.stringify(nuevasAsignaturas));

      return nuevasAsignaturas; // Retornar las nuevas asignaturas
    });

    if (profesorSeleccionado) {
      // Agregar la asignatura al profesor seleccionado
      const nuevoProfesor = { ...profesorSeleccionado };
      nuevoProfesor.asignaturas.push(asignatura);

      // Actualizar la lista de profesores con el profesor actualizado
      setProfesores((prevProfesores) =>
        prevProfesores.map((profesor) =>
          profesor.id === nuevoProfesor.id ? nuevoProfesor : profesor
        )
      );
    }
    if (botonSemanalRef.current) {
      botonSemanalRef.current.click(); // Asegúrate de que sea una función
    }
  };

  const handleEliminarAsignatura = (index: number) => {
    if (profesorSeleccionado) {
      const nuevoProfesor = { ...profesorSeleccionado };
      const asignaturaEliminada = nuevoProfesor.asignaturas[index];

      // Verificamos que la asignatura a eliminar existe
      if (asignaturaEliminada) {
        nuevoProfesor.asignaturas.splice(index, 1);

        // Actualizamos el estado de los profesores
        setProfesores((prevProfesores) => {
          const nuevosProfesores = prevProfesores.map((profesor) =>
            profesor.id === nuevoProfesor.id ? nuevoProfesor : profesor
          );

          // Guardamos en localStorage solo después de actualizar el estado
          localStorage.setItem("profesores", JSON.stringify(nuevosProfesores));
          return nuevosProfesores; // Retornamos la nueva lista de profesores
        });

        // Actualizamos el estado de asignaturas
        setAsignaturas((prevAsignaturas) => {
          const nuevasAsignaturas = prevAsignaturas.filter(
            (_, i) => i !== index
          );

          // Guardar las nuevas asignaturas en localStorage
          localStorage.setItem(
            "asignaturas",
            JSON.stringify(nuevasAsignaturas)
          );

          return nuevasAsignaturas; // Actualiza el estado global de asignaturas
        });
        if (botonSemanalRef.current) {
          botonSemanalRef.current.click(); // Asegúrate de que sea una función
        }
      }
    }
  };

  useEffect(() => {
    if (profesorSeleccionado) {
      const asignaturasProfesor = asignaturas.filter(
        (asignatura) => asignatura.profesorId === profesorSeleccionado.id
      );

      // Actualizar el estado del profesor seleccionado con las nuevas asignaturas
      setProfesorSeleccionado((prev: Profesor) => {
        if (!prev) return null;
        return {
          ...prev,
          asignaturas: asignaturasProfesor,
        };
      });

      // Llamamos a calcularTotalHoras solo cuando las asignaturas cambian
      calcularTotalHoras();
    }
  }, [modoSemanal]); // Asegúrate de incluir 'profesorSeleccionado' para evitar ciclos

  return (
    <div className="inicio">
      <div className="info-profesor">
        <div>
          <p className="text_Profesores">Inicio</p>
          <p className="text_Crea_Y_Gestiona">
            Gestiona las asginaturas de tus profesores
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
            <img
              src={
                profesorSeleccionado && profesores.length > 0
                  ? profesorSeleccionado.logo
                  : imgMM
              }
              alt="Profesor logo"
              className="profesor-logo"
            />
          </div>
          <div className="parrafos-contenedor">
            <p className="profesor-nombre">
              {profesorSeleccionado && profesores.length > 0
                ? `${profesorSeleccionado.nombre} ${profesorSeleccionado.apellido} ${profesorSeleccionado.segundoApellido}`
                : "Selecciona o crea profesores"}
            </p>
            {profesorSeleccionado && profesores.length > 0 && (
              <div>
                <a className="email-link" href={`mailto:${emailUsuario}`}>
                  {profesorSeleccionado.email}
                </a>
              </div>
            )}
            {profesorSeleccionado && profesores.length > 0 && (
              <p className="tlf">{profesorSeleccionado.telefono}</p>
            )}
          </div>
        </div>

        <hr className="linea-gris" />
        <div className="container">
          <button
            id="semanal"
            ref={botonSemanalRef}
            className={`btn btn-secondary btn-custom ${
              modoSemanal ? "active" : ""
            }`}
            style={{
              backgroundColor: modoSemanal ? "transparent" : "#ffff",
              color: modoSemanal ? "#6c757d" : "#000000",
              border: "none",
            }}
            onClick={() => {
              setModoSemanal(false);
              calcularTotalHoras();
            }}
            disabled={!modoSemanal} // Desactiva el botón "Semanal" cuando `modoSemanal` es `true`
          >
            Semanal
          </button>

          <button
            id="anual"
            className={`btn btn-secondary btn-custom ${
              !modoSemanal ? "active" : ""
            }`}
            style={{
              backgroundColor: !modoSemanal ? "transparent" : "#ffff",
              color: !modoSemanal ? "#6c757d" : "#000000",
              border: "none",
            }}
            onClick={() => {
              setModoSemanal(true);
              calcularTotalHoras();
            }}
            disabled={modoSemanal} // Desactiva el botón "Anual" cuando `modoSemanal` es `false`
          >
            Anual
          </button>
        </div>

        <div id="cardsContainer" className="container mt-5">
          <Row>
            <Col className="d-flex justify-content-around">
              <Card>
                <Card.Body>
                  <Card.Title>Horas totales</Card.Title>
                  <Card.Text>{totalHoras} Horas</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex justify-content-around">
              <Card>
                <Card.Body>
                  <Card.Title>Horas Lectivas</Card.Title>
                  <Card.Text>{totalHoras} Horas</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex justify-content-around">
              <Card>
                <Card.Body>
                  <Card.Title>Horas Complementarias</Card.Title>
                  <Card.Text>0 Horas</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        <hr className="linea-gris" />
        <div className="boton-container">
          <button
            className="boton-añadir-asignatura"
            onClick={mostrarFormularioAgregarAsignatura}
          >
            <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
            <span>Añadir asignatura</span>
          </button>
        </div>
        {mostrarFormulario && (
          <FormularioAgregarAsignatura
            onClose={cerrarFormularioAgregarAsignatura}
            columnas={columnas}
            onAgregarAsignatura={handleAgregarAsignatura}
            profesorId={profesorSeleccionado!!.id}
            espacios={espacios}
          />
        )}

        <Table bordered className="mi-tabla">
          <thead>
            <tr>
              <th className="thStart">Nombre</th>
              <th>Tipo</th>
              <th>Curso</th>
              <th>Grupo</th>
              <th>Hora Semanal</th>
              <th>Espacio Regular</th>
              <th className="thFinal">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesorSeleccionado?.asignaturas.map(
              (asignatura: Asignatura, index: number) => (
                <tr key={index}>
                  <td>{asignatura.nombre}</td>
                  <td>{asignatura.tipo}</td>
                  <td>{asignatura.curso}</td>
                  <td>{asignatura.grupo}</td>
                  <td>{asignatura.horaSemanal}</td>
                  <td>
                    {asignatura.espacioRegular} - {asignatura.grupo}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-editar"
                      onClick={() => setMostrarPopup(true)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="light"
                      className="btn-eliminar"
                      onClick={() => handleEliminarAsignatura(index)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>

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
  );
};

export default Inicio;
