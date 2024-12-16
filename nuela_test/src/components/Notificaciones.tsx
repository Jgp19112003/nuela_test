import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Profesor } from "../interfaces/Profesor";
import { Alumno } from "../interfaces/Alumno";
import "../styles/Notificaciones.css";
import { Button } from "react-bootstrap";

export const Notificaciones = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [destinatarios, setDestinatarios] = useState<string[]>([]);
  const [personas, setPersonas] = useState<(Profesor | Alumno)[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDestinatario, setSelectedDestinatario] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectAllAlumnos, setSelectAllAlumnos] = useState(false);
  const [selectAllProfesores, setSelectAllProfesores] = useState(false);

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const profesoresStorage = localStorage.getItem("profesores");
    const alumnosStorage = localStorage.getItem("alumnos");

    const profesores: Profesor[] = profesoresStorage
      ? JSON.parse(profesoresStorage)
      : [];
    const alumnos: Alumno[] = alumnosStorage ? JSON.parse(alumnosStorage) : [];

    setPersonas([...profesores, ...alumnos]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddDestinatario = (email: string) => {
    if (!destinatarios.includes(email)) {
      setDestinatarios((prev) => [...prev, email]);
    }
    setShowDropdown(false);
  };

  const handleRemoveDestinatario = (email: string) => {
    setDestinatarios(
      destinatarios.filter((destinatario) => destinatario !== email)
    );
  };

  const handleSelectAllAlumnos = () => {
    if (selectAllAlumnos) {
      const alumnos = personas
        .filter((persona) => "grupo" in persona)
        .map((alumno) => alumno.email);
      setDestinatarios((prev) => [...prev, ...alumnos]);
    } else {
      const alumnos = personas
        .filter((persona) => "grupo" in persona)
        .map((alumno) => alumno.email);
      setDestinatarios(
        destinatarios.filter((email) => !alumnos.includes(email))
      );
    }
    setSelectAllAlumnos(!selectAllAlumnos);
  };

  const handleSelectAllProfesores = () => {
    if (selectAllProfesores) {
      const profesores = personas
        .filter((persona) => !("grupo" in persona))
        .map((profesor) => profesor.email);
      setDestinatarios((prev) => [...prev, ...profesores]);
    } else {
      const profesores = personas
        .filter((persona) => !("grupo" in persona))
        .map((profesor) => profesor.email);
      setDestinatarios(
        destinatarios.filter((email) => !profesores.includes(email))
      );
    }
    setSelectAllProfesores(!selectAllProfesores);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (destinatarios.length === 0) {
      alert("Por favor, selecciona al menos un destinatario.");
      return;
    }

    const serviceId = "service_qt2yhea";
    const templateId = "template_fdheih9";
    const publicKey = "1IHwKhC57LUa02mlK";

    const templateParams = {
      from_name: name,
      from_email: email,
      to_email: destinatarios.join(", "),
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        setName("");
        setEmail("");
        setMessage("");
        setDestinatarios([]);

        // Mostrar el mensaje de éxito
        setShowSuccessAlert(true);

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
      });
  };

  return (
    <div className="inicio">
      <div className="info-profesor">
        <div>
          <p className="text_Profesores">Notificaciones</p>
          <p className="text_Crea_Y_Gestiona">
            Notifica a tus profesores o alumnos sobre eventos importantes
          </p>
        </div>
        <hr className="linea-gris" />

        {showSuccessAlert && (
          <div className="alert-success">
            <p>Notificación enviada exitosamente!</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="emailForm">
          <div className="select-container">
            <div
              className="dropdown"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedDestinatario || "Selecciona los destinatarios"}
            </div>
            {showDropdown && (
              <ul className="dropdown-list" ref={dropdownRef}>
                {personas.map((persona) => (
                  <li
                    key={persona.id}
                    className="dropdown-item"
                    onClick={() => {
                      handleAddDestinatario(persona.email);
                      setSelectedDestinatario(
                        `${persona.nombre} ${persona.apellido}`
                      );
                    }}
                  >
                    <img
                      src={persona.logo}
                      alt="Logo"
                      className="persona-logo"
                    />
                    {persona.nombre} {persona.apellido}{" "}
                    {"grupo" in persona ? "(Alumno)" : "(Profesor)"}
                  </li>
                ))}
              </ul>
            )}
            <div className="button-container">
              <button
                type="button"
                onClick={handleSelectAllAlumnos}
                className={`button ${selectAllAlumnos ? "selected" : ""}`}
              >
                Alumnos
              </button>
              <button
                type="button"
                onClick={handleSelectAllProfesores}
                className={`button ${selectAllProfesores ? "selected" : ""}`}
              >
                Profesores
              </button>
            </div>
          </div>
          <div>
            {destinatarios.length > 0 && (
              <>
                <p>Destinatarios seleccionados:</p>
                <ul>
                  {destinatarios.map((email, index) => (
                    <li key={index}>
                      {email}{" "}
                      <Button
                        variant="light"
                        className="btn-eliminar"
                        onClick={() => handleRemoveDestinatario(email)}
                      >
                        Eliminar
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <input
            type="text"
            placeholder="Título"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            cols={30}
            rows={10}
            placeholder="Escribe tu mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit" className="boton-notificacion">
            Enviar Notificación
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notificaciones;
