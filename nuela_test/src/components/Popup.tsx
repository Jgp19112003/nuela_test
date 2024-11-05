import React, { useState } from "react";
import "../styles/Popup.css";
import { Profesor } from "../interfaces/Profesor";
import { PopupProps } from "../interfaces/PopupProps";

const Popup: React.FC<PopupProps> = ({
  profesores,
  onClose,
  onProfesorSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar los profesores basándose en el término de búsqueda
  const filteredProfesores = profesores
    .filter((profesor) =>
      `${profesor.nombre} ${profesor.apellido} ${profesor.segundoApellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .slice(0, 15); // Limitar a un máximo de 15 elementos

  // Manejar el clic en el overlay para cerrar el pop-up
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Llamar a onProfesorSelect con el profesor seleccionado y cerrar el pop-up
  const handleProfesorClick = (profesor: Profesor) => {
    onProfesorSelect(profesor);
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup">
        <div className="popup-header">
          <input
            type="text"
            placeholder="Buscar profesor..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="popup-content">
          {filteredProfesores.map((profesor) => (
            <div
              key={profesor.id}
              className="opcion-profesor"
              onClick={() => handleProfesorClick(profesor)} // Al hacer clic en un profesor
            >
              <img
                src={profesor.logo}
                alt="Logo profesor"
                className="profesor-logo"
              />
              <span>{`${profesor.nombre} ${profesor.apellido} ${profesor.segundoApellido}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
