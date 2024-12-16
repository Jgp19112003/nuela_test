import React, { useState, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import selectImage from "../images/selectImage.png";
import "../styles/Form.css";
import { Asignatura } from "../interfaces/Asignatura";

interface FormularioAgregarHorarioProps {
  onClose: () => void;
  onAgregarHorario: (
    dia: string,
    hora: string,
    asignatura: Asignatura,
    profesorId: number
  ) => void;
  profesorId: number;
  asignaturas: Asignatura[]; // List of subjects for the professor
}

const FormularioAgregarHorario: React.FC<FormularioAgregarHorarioProps> = ({
  onClose,
  onAgregarHorario,
  profesorId,
  asignaturas,
}) => {
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (dia && hora && asignatura) {
      const selectedAsignatura = asignaturas.find(
        (a) => a.nombre === asignatura
      );
      if (selectedAsignatura) {
        onAgregarHorario(dia, hora, selectedAsignatura, profesorId);
        onClose();
      }
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title>Agregar Horario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Form.Group controlId="formDia">
            <Form.Label>Día:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione un día
                </option>
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                ].map((dia, index) => (
                  <option key={index} value={dia}>
                    {dia}
                  </option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          <Form.Group controlId="formHora">
            <Form.Label>Hora:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione una hora
                </option>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                ].map((hora, index) => (
                  <option key={index} value={hora}>
                    {hora}
                  </option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          <Form.Group controlId="formAsignatura">
            <Form.Label>Asignatura:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={asignatura}
                onChange={(e) => setAsignatura(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione una asignatura
                </option>
                {asignaturas.map((asignatura, index) => (
                  <option key={index} value={asignatura.nombre}>
                    {asignatura.nombre} - {asignatura.espacioRegular}
                  </option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "15px",
            }}
          >
            <Button variant="primary" type="submit">
              Añadir Horario
            </Button>
          </div>
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

export default FormularioAgregarHorario;
