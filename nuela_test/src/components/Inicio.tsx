import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Button } from "react-bootstrap";
import "../styles/Inicio.css";
import imgMM from "../images/MM.png";
import plusIcono from "../images/plus.png";
import FormularioAgregarAsignatura from "./FormularioAgregarAsignatura";
import { Asignatura } from "../interfaces/Asignatura";
import axios from "axios";

const Inicio = () => {
  const [modoSemanal, setModoSemanal] = useState(true);

  const [modoLectivas, setModoLectivas] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(() => {
    const storedAsignaturas = localStorage.getItem("asignaturas");
    return storedAsignaturas ? JSON.parse(storedAsignaturas) : [];
  });
  const [totalHoras, setTotalHoras] = useState<number>(0);
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [emailUsuario, setEmailUsuario] = useState<string>("");
  const [telefonoUsuario, setTelefonoUsuario] = useState<string>("");

  const columnas = [
    ["Matemáticas", "Física", "Química"],
    ["Obligatoria", "Optativa"],
    ["1º Bachillerato", "2º Bachillerato"],
    ["A", "B", "C"],
    ["3 h", "3,5 h", "4 h", "4,5 h", "5 h"],
    ["1º Bach - Grupo A", "1º Bach - Grupo B", "2º Bach - Grupo A"],
  ];

  const obtenerDatosUsuarioAleatorio = async () => {
    try {
      const respuesta = await axios.get("https://randomuser.me/api/?results=1");
      const usuario = respuesta.data.results[0];
      setNombreUsuario(
        `${usuario.name.title} ${usuario.name.first} ${usuario.name.last}`
      );
      setEmailUsuario(usuario.email);
      setTelefonoUsuario(usuario.phone);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  useEffect(() => {
    setModoSemanal(false);
    calcularTotalHoras();
    localStorage.setItem("asignaturas", JSON.stringify(asignaturas));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asignaturas]);

  useEffect(() => {
    obtenerDatosUsuarioAleatorio();
  }, []);
  const calcularTotalHoras = () => {
    let total = 0;
    asignaturas.forEach((asignatura) => {
      // Verificar si el modo es semanal o anual y sumar las horas correspondientes
      if (modoSemanal) {
        total += parseFloat(asignatura.horaSemanal.replace(",", "."));
      } else {
        // Convertir las horas semanales a horas anuales
        total += parseFloat(asignatura.horaSemanal.replace(",", ".")) * 52; // 52 semanas en un año
      }
    });
    setTotalHoras(total);
  };

  const handleSwitch = () => {
    calcularTotalHoras();
  };

  const mostrarFormularioAgregarAsignatura = () => {
    setMostrarFormulario(true);
  };

  const cerrarFormularioAgregarAsignatura = () => {
    setMostrarFormulario(false);
  };

  const handleAgregarAsignatura = (asignatura: Asignatura) => {
    setAsignaturas([...asignaturas, asignatura]);
  };

  const handleEliminarAsignatura = (index: number) => {
    const nuevasAsignaturas = [...asignaturas];
    nuevasAsignaturas.splice(index, 1);
    setAsignaturas(nuevasAsignaturas);
  };

  return (
    <div className="inicio">
      <div className="info-profesor">
        <div>
          <p className="text_Profesores">Profesores</p>
          <p className="text_Crea_Y_Gestiona">Crea y gestiona los profesores</p>
        </div>
        <hr className="linea-gris" />
        <div className="parrafosInfo">
          <div className="profesor-img">
            <img src={imgMM} alt="Profesor logo" className="profesor-logo" />
          </div>
          <div className="parrafos-contenedor">
            <p className="profesor-nombre">{nombreUsuario}</p>
            <div>
              <a className="email-link" href={`mailto:${emailUsuario}`}>
                {emailUsuario}
              </a>
            </div>
            <p className="tlf">{telefonoUsuario}</p>
          </div>
        </div>
        <button className="editar-button">Editar</button>
        <hr className="linea-gris" />
        <div className="container" onClick={handleSwitch}>
          <button
            className={`btn btn-secondary btn-custom ${
              modoSemanal ? "active" : ""
            }`}
            style={{
              backgroundColor: modoSemanal ? "transparent" : "#ffff", // Transparente si está activo, gris si no
              color: modoSemanal ? "#6c757d" : "#000000", // Gris si está activo, negro si no
              border: "none",
            }}
            onClick={() => setModoSemanal(!modoSemanal)} // Cambia el estado al contrario del estado actual
          >
            Semanal
          </button>
          <button
            className={`btn btn-secondary btn-custom ${
              !modoSemanal ? "active" : ""
            }`}
            style={{
              backgroundColor: !modoSemanal ? "transparent" : "#ffff", // Transparente si está activo, gris si no
              color: !modoSemanal ? "#6c757d" : "#000000", // Gris si está activo, negro si no
              border: "none",
            }}
            onClick={() => setModoSemanal(!modoSemanal)} // Cambia el estado al contrario del estado actual
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

        <button
          className="boton-añadir-asignatura"
          onClick={mostrarFormularioAgregarAsignatura}
        >
          <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
          <span>Añadir asignatura</span>
        </button>
        {mostrarFormulario && (
          <FormularioAgregarAsignatura
            onClose={cerrarFormularioAgregarAsignatura}
            columnas={columnas}
            onAgregarAsignatura={handleAgregarAsignatura}
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
            {asignaturas.map((asignatura, index) => (
              <tr key={index}>
                <td>{asignatura.nombre}</td>
                <td>{asignatura.tipo}</td>
                <td>{asignatura.curso}</td>
                <td>{asignatura.grupo}</td>
                <td>{asignatura.horaSemanal}</td>
                <td>{asignatura.espacioRegular}</td>
                <td>
                  <Button variant="light" className="btn-ver">
                    Ver
                  </Button>
                  <Button variant="light" className="btn-editar">
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
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Inicio;
