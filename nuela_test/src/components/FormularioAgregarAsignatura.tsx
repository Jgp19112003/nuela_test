import React, { useState, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import selectImage from "../images/selectImage.png";
import "../styles/Form.css";
import { Asignatura } from "../interfaces/Asignatura";

interface FormularioAgregarAsignaturaProps {
  onClose: () => void;
  columnas: string[][];
  onAgregarAsignatura: (asignatura: Asignatura, profesorId: number) => void;
  profesorId: number;
}

const FormularioAgregarAsignatura: React.FC<
  FormularioAgregarAsignaturaProps
> = ({ onClose, columnas, onAgregarAsignatura, profesorId }) => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [curso, setCurso] = useState("");
  const [grupo, setGrupo] = useState("");
  const [horaSemanal, setHoraSemanal] = useState("");
  const [espacioRegular, setEspacioRegular] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nombre && tipo && curso && grupo && horaSemanal && espacioRegular) {
      const asignatura: Asignatura = {
        profesorId: profesorId,
        nombre: nombre,
        tipo: tipo,
        curso: curso,
        grupo: grupo,
        horaSemanal: horaSemanal,
        espacioRegular: espacioRegular,
      };

      // Llamar a la función para agregar la asignatura
      onAgregarAsignatura(asignatura, profesorId);

      // Cerrar el modal
      onClose();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title>Agregar Asignatura</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre">
            <Form.Label>Selecciona la asignatura:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione asignatura
                </option>
                {columnas[0].map((valor, index) => (
                  <option key={index}>{valor}</option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>
          <Form.Group controlId="formTipo">
            <Form.Label>Tipo de asignatura:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="" disabled hidden>
                  Seleccione tipo de asignatura
                </option>
                {columnas[1].map((valor, index) => (
                  <option key={index}>{valor}</option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>
          <Form.Group controlId="formCurso">
            <Form.Label>Curso:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
              >
                <option value="" disabled hidden>
                  Seleccione curso
                </option>
                {columnas[2].map((valor, index) => (
                  <option key={index}>{valor}</option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>
          <Form.Group controlId="formGrupo">
            <Form.Label>Grupo:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
              >
                <option value="" disabled hidden>
                  Seleccione grupo
                </option>
                {columnas[3].map((valor, index) => (
                  <option key={index}>{valor}</option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>
          <Form.Group controlId="formHoraSemanal">
            <Form.Label>Horas (Semanales):</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={horaSemanal}
                onChange={(e) => setHoraSemanal(e.target.value)}
              >
                <option value="" disabled hidden>
                  Seleccione horas
                </option>
                {columnas[4].map((valor, index) => (
                  <option key={index}>{valor}</option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>
          <Form.Group controlId="formEspacioRegular">
            <Form.Label>Espacio:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={espacioRegular}
                onChange={(e) => setEspacioRegular(e.target.value)}
              >
                <option value="" disabled hidden>
                  Seleccione espacio
                </option>
                {columnas[5].map((valor, index) => (
                  <option key={index}>{valor}</option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>
          <Button variant="primary" type="submit">
            Añadir asignatura
          </Button>
        </Form>
      </Modal.Body>
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          Por favor completa todos los campos del formulario.
        </div>
      )}
    </Modal>
  );
};

export default FormularioAgregarAsignatura;
