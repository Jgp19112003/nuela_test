import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoTajamar from "../images/logoTajamar.png";
import logoInicio from "../images/nuelaLogo.png";
import logoHorarios from "../images/logoHorarios.png";
import logoProfesores from "../images/logoProfesores.png";
import logoFamilias from "../images/logoFamilias.png";
import logoEspacios from "../images/logoEspacios.png";
import logoAsignaturas from "../images/logoAsignaturas.png";
import logoNotificaciones from "../images/logoNotificaciones.png";
import logoSettings from "../images/logoSettings.png";
import axios from "axios";
import "../styles/Sidebar.css";

function Sidebar() {
  const usuario = {
    nombreColegio: "Tajamar",
    foto: logoTajamar,
  };

  const [nombreColegio] = useState(usuario.nombreColegio);
  const [fotoUsuario, setFotoUsuario] = useState(usuario.foto);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const respuesta = await axios.get(
          "https://randomuser.me/api/?results=1"
        );
        const usuario = respuesta.data.results[0];
        setFotoUsuario(usuario.picture.medium);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    obtenerDatosUsuario();
  }, []);

  return (
    <div className="sidebar">
      <div className="user-profile">
        <img
          src={logoTajamar}
          alt="Foto de colegio"
          className="colegio-avatar"
        />
        <p className="user-name">{nombreColegio}</p>
        {/* <img src={fotoUsuario} alt="Logo usuario" className="secondary-logo" /> */}
      </div>
      <div className="menu">
        <Link to="/inicio" className="menu-item-link">
          <div className="menu-item">
            <img src={logoInicio} alt="Inicio" className="menu-item-logo" />
            <span className="menu-item-text">Inicio</span>
          </div>
        </Link>
        <Link to="/horarios" className="menu-item-link">
          <div className="menu-item">
            <img src={logoHorarios} alt="Horarios" className="menu-item-logo" />
            <span className="menu-item-text">Horarios</span>
          </div>
        </Link>
        <Link to="/profesores" className="menu-item-link">
          <div className="menu-item">
            <img
              src={logoProfesores}
              alt="Profesores"
              className="menu-item-logo"
            />
            <span className="menu-item-text">Profesores</span>
          </div>
        </Link>
        <Link to="/alumnos" className="menu-item-link">
          <div className="menu-item">
            <img src={logoFamilias} alt="Alumnos" className="menu-item-logo" />
            <span className="menu-item-text">Alumnos</span>
          </div>
        </Link>
        <Link to="/espacios" className="menu-item-link">
          <div className="menu-item">
            <img src={logoEspacios} alt="Espacios" className="menu-item-logo" />
            <span className="menu-item-text">Espacios</span>
          </div>
        </Link>
        <Link to="/notificaciones" className="menu-item-link">
          <div className="menu-item">
            <img
              src={logoNotificaciones}
              alt="Notificaciones"
              className="menu-item-logo"
            />
            <span className="menu-item-text">Notificaciones</span>
          </div>
        </Link>
        <Link to="/settings" className="menu-item-link">
          <div className="menu-item">
            <img src={logoSettings} alt="Settings" className="menu-item-logo" />
            <span className="menu-item-text">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
