import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import defaultProfileImage from "../images/defaultImg.png";
import { Alumno } from "../interfaces/Alumno";
import { Espacio } from "../interfaces/Espacio";
import selectImage from "../images/selectImage.png";

interface FormularioAgregarAlumnoProps {
  onClose: () => void;
  onAgregarAlumno: (alumno: Alumno) => void;
  alumno?: Alumno | null;
}

const FormularioAgregarAlumno: React.FC<FormularioAgregarAlumnoProps> = ({
  onClose,
  onAgregarAlumno,
  alumno,
}) => {
  const [nombre, setNombre] = useState(alumno?.nombre || "");
  const [apellido, setApellido] = useState(alumno?.apellido || "");
  const [segundoApellido, setSegundoApellido] = useState(
    alumno?.segundoApellido || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState(
    alumno?.fechaNacimiento || ""
  );
  const [telefonoTutor, setTelefonoTutor] = useState(
    alumno?.telefonoTutor?.toString() || ""
  );
  const [email, setEmail] = useState(alumno?.email || "");
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(
    alumno?.logo || defaultProfileImage
  );
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<
    Espacio | undefined
  >(); // Estado para el espacio seleccionado
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>(""); // Estado para el grupo seleccionado
  const [notas, setNotas] = useState<number[]>(alumno?.notas || []); // Estado para las notas del alumno
  const [espacios, setEspacios] = useState<Espacio[]>([]); // Lista de espacios
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const storedEspacios = localStorage.getItem("espacios");
    if (storedEspacios) {
      const parsedEspacios = JSON.parse(storedEspacios);
      setEspacios(parsedEspacios);
    }
  }, []);

  useEffect(() => {
    if (alumno) {
      setNombre(alumno.nombre);
      setApellido(alumno.apellido);
      setSegundoApellido(alumno.segundoApellido);
      setFechaNacimiento(alumno.fechaNacimiento);
      setTelefonoTutor(alumno.telefonoTutor.toString());
      setEmail(alumno.email);
      setLogo(alumno.logo || defaultProfileImage);
      setEspacioSeleccionado(alumno.espacio);
      setGrupoSeleccionado(alumno.grupo || ""); // Establecer el grupo si está editando
      setNotas(alumno.notas); // Cargar las notas del alumno
    }
  }, [alumno]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  // Obtener los grupos disponibles del espacio seleccionado
  const gruposDisponibles = espacioSeleccionado
    ? espacioSeleccionado.grupos
    : [];

  // Función para manejar el cambio de notas
  const handleNotaChange = (index: number, value: string) => {
    const updatedNotas = [...notas];
    updatedNotas[index] = value ? parseFloat(value) : NaN; // Redondea a dos decimales
    setNotas(updatedNotas);
  };

  // Función para calcular la media de las notas
  const calcularMedia = () => {
    const notasValidas = notas.filter((nota) => !isNaN(nota)); // Filtra las notas válidas
    if (notasValidas.length === 0) return 0; // Si no hay notas válidas, devuelve 0
    const sumaNotas = notasValidas.reduce((acc, nota) => acc + nota, 0);
    const media = sumaNotas / notasValidas.length;
    return Math.round(media * 100) / 100; // Redondea la media a dos decimales
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      nombre &&
      apellido &&
      segundoApellido &&
      fechaNacimiento &&
      telefonoTutor &&
      email &&
      espacioSeleccionado &&
      grupoSeleccionado
    ) {
      const media = calcularMedia(); // Calcula la media antes de guardar los datos

      const nuevoAlumno: Alumno = {
        id: alumno ? alumno.id : Math.random(), // Mantiene el ID si está editando
        nombre,
        apellido,
        segundoApellido,
        fechaNacimiento,
        telefonoTutor: parseInt(telefonoTutor),
        email,
        espacio: espacioSeleccionado, // Usar el espacio seleccionado
        grupo: grupoSeleccionado, // Usar el grupo seleccionado
        asignaturas: espacioSeleccionado ? espacioSeleccionado.asignaturas : [], // Usar las asignaturas del espacio
        notas, // Usar las notas del alumno
        evaluacion: media, // Asigna la media calculada a evaluacion
        logo: typeof logo === "string" ? logo : "",
      };

      onAgregarAlumno(nuevoAlumno);
      onClose();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title>{alumno ? "Editar Alumno" : "Agregar Alumno"}</Modal.Title>
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
          {/* Campos del formulario */}
          <Form.Group controlId="formEspacio">
            <Form.Label>Espacio:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={espacioSeleccionado?.curso || ""}
                onChange={(e) => {
                  const espacioSeleccionado = espacios.find(
                    (espacio) => espacio.curso === e.target.value
                  );
                  setEspacioSeleccionado(espacioSeleccionado!!);
                  setGrupoSeleccionado("");
                }}
                required
              >
                <option value="">Seleccione un espacio</option>
                {espacios.map((espacio, index) => (
                  <option key={index} value={espacio.curso}>
                    {espacio.curso}
                  </option>
                ))}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          {/* Selección de grupo, basado en el espacio seleccionado */}
          <Form.Group controlId="formGrupo">
            <Form.Label>Grupo:</Form.Label>
            <div className="select-container">
              <Form.Control
                as="select"
                value={grupoSeleccionado}
                onChange={(e) => setGrupoSeleccionado(e.target.value)}
                disabled={!espacioSeleccionado}
                required
              >
                <option value="" disabled hidden>
                  Seleccione un grupo
                </option>
                {espacioSeleccionado
                  ? gruposDisponibles.map((grupo, index) => (
                      <option key={index} value={grupo}>
                        {grupo}
                      </option>
                    ))
                  : null}
              </Form.Control>
              <img src={selectImage} alt="select" className="select-icon" />
            </div>
          </Form.Group>

          {/* Otros campos del formulario */}
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

          <Form.Group controlId="formTelefonoTutor">
            <Form.Label>Teléfono del Tutor:</Form.Label>
            <Form.Control
              type="text"
              value={telefonoTutor}
              onChange={(e) => setTelefonoTutor(e.target.value)}
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

          <div
            className="row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)", // 4 columnas de ancho igual
              gap: "10px", // Espacio entre las asignaturas
            }}
          >
            {alumno?.espacio?.asignaturas?.map((asignatura, index) => (
              <div key={index}>
                {/* Nombre de la asignatura */}
                <Form.Label style={{ textAlign: "center" }}>
                  {asignatura.nombre}
                </Form.Label>

                {/* Campo de la nota */}
                <Form.Control
                  type="number"
                  value={notas[index] || ""}
                  onChange={(e) => handleNotaChange(index, e.target.value)}
                  min="0"
                  max="10"
                  step="0.1" // Permite valores decimales con un paso de 0.1
                  placeholder="Nota"
                  style={{ width: "100%" }} // El input ocupa todo el ancho disponible en el contenedor
                />
              </div>
            ))}
          </div>

          {/* Logo de alumno */}
          <Form.Group controlId="formLogo">
            <Form.Label>Logo:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Form.Group>

          {/* Botón para agregar o guardar el alumno */}
          <Button variant="primary" type="submit">
            {alumno ? "Guardar Datos" : "Añadir Alumno"}
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

export default FormularioAgregarAlumno;
