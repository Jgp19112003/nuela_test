import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import defaultProfileImage from "../images/defaultImg.png";
import "../styles/Form.css";
import { Profesor } from "../interfaces/Profesor";

interface FormularioAgregarProfesorProps {
  onClose: () => void;
  onAgregarProfesor: (profesor: Profesor) => void;
  profesor?: Profesor | null;
}

const FormularioAgregarProfesor: React.FC<FormularioAgregarProfesorProps> = ({
  onClose,
  onAgregarProfesor,
  profesor,
}) => {
  const [nombre, setNombre] = useState(profesor?.nombre || "");
  const [apellido, setApellido] = useState(profesor?.apellido || "");
  const [segundoApellido, setSegundoApellido] = useState(
    profesor?.segundoApellido || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState(
    profesor?.fechaNacimiento || ""
  );
  const [telefono, setTelefono] = useState(profesor?.telefono.toString() || "");
  const [email, setEmail] = useState(profesor?.email || "");
  const [especialidad, setEspecialidad] = useState(
    profesor?.especialidad || ""
  );
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(
    profesor?.logo || defaultProfileImage
  );
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (profesor) {
      setNombre(profesor.nombre);
      setApellido(profesor.apellido);
      setSegundoApellido(profesor.segundoApellido);
      setFechaNacimiento(profesor.fechaNacimiento);
      setTelefono(profesor.telefono.toString());
      setEmail(profesor.email);
      setEspecialidad(profesor.especialidad);
      setLogo(profesor.logo || defaultProfileImage);
    }
  }, [profesor]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      nombre &&
      apellido &&
      segundoApellido &&
      fechaNacimiento &&
      telefono &&
      email &&
      especialidad
    ) {
      const nuevoProfesor: Profesor = {
        id: profesor ? profesor.id : Math.random(), // Mantiene el ID si está editando
        nombre,
        apellido,
        segundoApellido,
        fechaNacimiento,
        telefono: parseInt(telefono),
        email,
        asignaturas: profesor ? profesor.asignaturas : [], // Mantiene asignaturas si está editando
        eventos: profesor ? profesor.eventos : [], // Mantiene eventos si está editando
        especialidad,
        evaluacion: profesor ? profesor.evaluacion : 0, // Mantiene evaluación si está editando
        logo: typeof logo === "string" ? logo : "",
      };

      // Llama la función de agregar (o actualizar) profesor
      onAgregarProfesor(nuevoProfesor);

      // Cierra el modal
      onClose();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title>Agregar Profesor</Modal.Title>
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
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formApellido">
            <Form.Label>Apellido:</Form.Label>
            <Form.Control
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSegundoApellido">
            <Form.Label>Segundo Apellido:</Form.Label>
            <Form.Control
              type="text"
              value={segundoApellido}
              onChange={(e) => setSegundoApellido(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFechaNacimiento">
            <Form.Label>Fecha de Nacimiento:</Form.Label>
            <Form.Control
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono:</Form.Label>
            <Form.Control
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEspecialidad">
            <Form.Label>Especialidad:</Form.Label>
            <Form.Control
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLogo">
            <Form.Label>Imagen de Perfil:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Form.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "15px",
            }}
          >
            <Button variant="primary" type="submit">
              {profesor ? "Guardar Datos" : "Añadir Profesor"}
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

export default FormularioAgregarProfesor;
