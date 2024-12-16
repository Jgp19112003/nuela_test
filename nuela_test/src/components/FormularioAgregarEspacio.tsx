import React, { useState, FormEvent, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/Form.css";
import { Espacio } from "../interfaces/Espacio";
import { Asignatura } from "../interfaces/Asignatura";
import { Profesor } from "../interfaces/Profesor";

interface FormularioAgregarEspacioProps {
  onClose: () => void;
  onAgregarespacio: (espacio: Espacio) => void;
  onEliminarEspacio?: (espacioCurso: string) => void;
  espacio?: Espacio | null;
  listaAsignaturas: Asignatura[];
  listaProfesores: Profesor[];
}

const FormularioAgregarEspacio: React.FC<FormularioAgregarEspacioProps> = ({
  onClose,
  onAgregarespacio,
  onEliminarEspacio, // Recibimos la función de eliminación
  espacio,
  listaAsignaturas,
  listaProfesores,
}) => {
  const [curso, setCurso] = useState(espacio?.curso || "");
  const [grupos, setGrupos] = useState(espacio?.grupos.join(", ") || "");
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] =
    useState<string>(
      espacio?.asignaturas.length
        ? espacio?.asignaturas.map((a) => a.nombre).join(", ")
        : ""
    );
  const [alumnos, setAlumnos] = useState(espacio?.alumnos.toString() || "1");
  const [showAlert, setShowAlert] = useState(false);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState<
    Profesor[]
  >([]);

  useEffect(() => {
    const profesoresRelacionados = listaProfesores.filter((profesor) =>
      profesor.asignaturas.some((asignatura) =>
        asignaturasSeleccionadas
          ? asignaturasSeleccionadas.split(", ").includes(asignatura.nombre)
          : false
      )
    );
    setProfesoresSeleccionados(profesoresRelacionados);
  }, [asignaturasSeleccionadas, listaProfesores]);

  useEffect(() => {
    if (espacio) {
      setCurso(espacio.curso);
      setGrupos(espacio.grupos.join(", "));
      setAsignaturasSeleccionadas(
        espacio.asignaturas.length
          ? espacio.asignaturas.map((a) => a.nombre).join(", ")
          : ""
      );
      setProfesoresSeleccionados(espacio.profesores);
      setAlumnos(espacio.alumnos.toString());
    }
  }, [espacio]);

  const actualizarLocalStorage = (espacioActualizado: Espacio) => {
    const espaciosGuardados = JSON.parse(
      localStorage.getItem("espacios") || "[]"
    );

    // Eliminar el espacio anterior si existe
    const espaciosActualizados = espaciosGuardados.filter(
      (e: Espacio) => e.curso !== espacioActualizado.curso
    );

    // Añadir el espacio actualizado a la lista
    espaciosActualizados.push(espacioActualizado);

    // Guardar la lista actualizada de espacios
    localStorage.setItem("espacios", JSON.stringify(espaciosActualizados));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      curso &&
      grupos &&
      asignaturasSeleccionadas &&
      asignaturasSeleccionadas.length &&
      alumnos
    ) {
      const nuevasAsignaturas = asignaturasSeleccionadas
        .split(",") // Separar las asignaturas por coma
        .map((nombre) => ({
          nombre: nombre.trim(),
          profesorId: null, // Asignar profesorId como null al agregar nuevas asignaturas
          tipo: "", // Asignar valor por defecto
          curso: "", // Asignar valor por defecto
          grupo: "", // Asignar valor por defecto
          horaSemanal: "", // Asignar valor por defecto
          espacioRegular: "", // Asignar valor por defecto
        }));

      // Si estamos editando el espacio, se comparan las asignaturas y se eliminan las que ya no están
      const asignaturasEliminadas = espacio
        ? espacio.asignaturas.filter(
            (asignatura) =>
              !nuevasAsignaturas.some(
                (nueva) => nueva.nombre === asignatura.nombre
              )
          )
        : [];

      // Crear el nuevo espacio
      const nuevoEspacio: Espacio = {
        curso,
        grupos: grupos
          .split(",")
          .map((grupo) => grupo.trim())
          .filter((grupo) => grupo !== ""),
        asignaturas: espacio
          ? [
              ...espacio.asignaturas.filter(
                (asignatura) =>
                  !asignaturasEliminadas.some(
                    (eliminada) => eliminada.nombre === asignatura.nombre
                  )
              ),
              ...nuevasAsignaturas.filter(
                (nueva) =>
                  !espacio.asignaturas.some(
                    (existe) => existe.nombre === nueva.nombre
                  )
              ),
            ]
          : nuevasAsignaturas,
        profesores: profesoresSeleccionados,
        alumnos: parseInt(alumnos),
      };

      onAgregarespacio(nuevoEspacio);
      actualizarLocalStorage(nuevoEspacio); // Guardar en el localStorage
      onClose();
    } else {
      setShowAlert(true);
    }
  };

  const handleEliminar = () => {
    if (espacio && onEliminarEspacio) {
      onEliminarEspacio(espacio.curso); // Llamamos a la función de eliminar pasando el id del espacio
      // Eliminar también de localStorage
      const espaciosGuardados = JSON.parse(
        localStorage.getItem("espacios") || "[]"
      );
      const espaciosActualizados = espaciosGuardados.filter(
        (e: Espacio) => e.curso !== espacio.curso
      );
      localStorage.setItem("espacios", JSON.stringify(espaciosActualizados));
      onClose();
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title>
          {espacio ? "Editar espacio" : "Agregar espacio"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCurso">
            <Form.Label>Curso:</Form.Label>
            <Form.Control
              type="text"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formGrupos">
            <Form.Label>Grupos (separados por coma):</Form.Label>
            <Form.Control
              type="text"
              value={grupos}
              onChange={(e) => setGrupos(e.target.value)}
              placeholder="A,B..."
              required
            />
          </Form.Group>

          <Form.Group controlId="formAsignaturas">
            <Form.Label>Asignaturas (separadas por coma):</Form.Label>
            <Form.Control
              type="text"
              value={asignaturasSeleccionadas}
              onChange={(e) => setAsignaturasSeleccionadas(e.target.value)}
              placeholder="Química, Lengua, Matemáticas..."
              required
            />
          </Form.Group>

          <Form.Group controlId="formAlumnos">
            <Form.Label>Número de Alumnos:</Form.Label>
            <Form.Control
              type="number"
              value={alumnos}
              onChange={(e) => setAlumnos(e.target.value)}
              required
              min="1"
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
              {espacio ? "Guardar Datos" : "Añadir Espacio"}
            </Button>
          </div>
        </Form>
      </Modal.Body>

      {showAlert && (
        <div className="alert alert-danger" role="alert">
          Por favor, completa todos los campos del formulario.
        </div>
      )}
    </Modal>
  );
};

export default FormularioAgregarEspacio;
