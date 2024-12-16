import React, { useState, useEffect, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import selectImage from "../images/selectImage.png";
import "../styles/Form.css";
import { Asignatura } from "../interfaces/Asignatura";
import { Espacio } from "../interfaces/Espacio"; // Importar la interfaz Espacio

interface FormularioAgregarAsignaturaProps {
  onClose: () => void;
  columnas: string[][]; // Asumo que este array sigue siendo útil
  onAgregarAsignatura: (asignatura: Asignatura, profesorId: number) => void;
  profesorId: number;
  espacios: Espacio[]; // Recibimos el array de espacios como prop
}

const FormularioAgregarAsignatura: React.FC<
  FormularioAgregarAsignaturaProps
> = ({
  onClose,
  columnas,
  onAgregarAsignatura,
  profesorId,
  espacios, // Array de espacios
}) => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [curso, setCurso] = useState("");
  const [grupo, setGrupo] = useState("");
  const [horaSemanal, setHoraSemanal] = useState("");
  const [espacioRegular, setEspacioRegular] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null); // Estado para el espacio seleccionado
  const [selectedAsignatura, setSelectedAsignatura] = useState(""); // Estado para la asignatura seleccionada
  const [showAlert, setShowAlert] = useState(false);

  // Al seleccionar un espacio, actualizamos los cursos y grupos disponibles
  useEffect(() => {
    if (selectedEspacio) {
      setCurso(selectedEspacio.curso); // Establecer el curso del espacio seleccionado
      setGrupo(selectedEspacio.grupos[0] || ""); // Establecer el primer grupo disponible
      setSelectedAsignatura(""); // Limpiar la asignatura seleccionada al cambiar el espacio
    }
  }, [selectedEspacio]);

  // Filtrar asignaturas según el espacio
  const asignaturasDisponibles = selectedEspacio
    ? selectedEspacio.asignaturas || [] // Suponiendo que `asignaturas` es una propiedad de `Espacio`
    : [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      nombre &&
      tipo &&
      curso &&
      grupo &&
      horaSemanal &&
      selectedEspacio // Verificar si un espacio ha sido seleccionado
    ) {
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

      // Actualizar los espacios en localStorage
      const espaciosGuardados: Espacio[] = JSON.parse(
        localStorage.getItem("espacios") || "[]"
      );

      // Encontramos el espacio que ha sido seleccionado
      const espacioIndex = espaciosGuardados.findIndex(
        (espacio) => espacio.curso === selectedEspacio.curso
      );

      if (espacioIndex !== -1) {
        // Si el espacio existe, actualizamos las asignaturas de ese espacio
        espaciosGuardados[espacioIndex].asignaturas.push(asignatura);
      } else {
        // Si no existe, lo agregamos como nuevo
        espaciosGuardados.push({
          ...selectedEspacio, // Copiamos el espacio seleccionado
          asignaturas: [asignatura], // Añadimos la nueva asignatura
        });
      }

      // Guardamos los espacios actualizados en localStorage
      localStorage.setItem("espacios", JSON.stringify(espaciosGuardados));

      // Cerrar el modal
      onClose();
    } else {
      // Mostrar mensaje de alerta solo si falta un campo obligatorio
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
          {/* Espacio */}
          <Form.Group controlId="formEspacioRegular">
            <Form.Label>Espacio:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={espacioRegular}
                onChange={(e) => {
                  const espacioSeleccionado = espacios.find(
                    (espacio) => espacio.curso === e.target.value
                  );
                  setEspacioRegular(e.target.value);
                  setSelectedEspacio(espacioSeleccionado || null); // Asegurarse de que este valor se actualiza correctamente
                }}
              >
                <option value="" disabled hidden>
                  Seleccione espacio
                </option>
                {espacios.map((espacio, index) => (
                  <option key={index} value={espacio.curso}>
                    {espacio.curso}
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
                value={selectedAsignatura}
                onChange={(e) => setNombre(e.target.value)}
                disabled={!selectedEspacio}
              >
                <option value="" disabled hidden>
                  Seleccione asignatura
                </option>
                {asignaturasDisponibles.map((asignatura, index) => (
                  <option key={index} value={asignatura.nombre}>
                    {asignatura.nombre}
                  </option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          {/* Tipo de asignatura */}
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

          {/* Grupo */}
          <Form.Group controlId="formGrupo">
            <Form.Label>Grupo:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
                disabled={!selectedEspacio} // Deshabilitado si no hay un espacio seleccionado
              >
                <option value="" disabled hidden>
                  Seleccione grupo
                </option>
                {selectedEspacio
                  ? selectedEspacio.grupos.map((valor, index) => (
                      <option key={index}>{valor}</option>
                    ))
                  : null}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          {/* Horas semanales */}
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

          {/* Botón para agregar asignatura */}
          <Button variant="primary" type="submit">
            Añadir asignatura
          </Button>
        </Form>
      </Modal.Body>

      {/* Mensaje de alerta si falta información */}
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          Por favor completa todos los campos del formulario.
        </div>
      )}
    </Modal>
  );
};

export default FormularioAgregarAsignatura;
