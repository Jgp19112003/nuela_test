import React from "react";
import "../styles/Profesores.css";
import plusIcono from "../images/plus.png";
export default function Profesores() {
  return (
    <div className="profesores">
      <div className="info-horarios">
        <div>
          <p className="text_Horarios">Profesores</p>
          <p className="text_Crea_Y_Gestiona">Gestiona tus profesores</p>
        </div>
        <hr className="linea-gris" />
        <button className="boton-añadir-profesor">
          <img src={plusIcono} alt="Mi Icono" className="icono-plus" />
          <span>Añadir profesor</span>
        </button>
      </div>
      <div className="card-profesores">
        <label className="avatar"></label>
        <label className="info">
          <span className="info-1">Jorge Gonzalez Perez</span>
          <span className="info-2">645239745</span>
          <a className="info-3 email-link" href="mail:to">
            jgp19112003@gmail.com
          </a>
          <span className="info-4">Matemáticas</span>
        </label>
        <div className="boton-container">
          <button className="bin-button">
            <svg className="bin-top" viewBox="0 0 39 7" fill="none">
              <line
                y1="5"
                x2="39"
                y2="5"
                stroke="white"
                stroke-width="4"
              ></line>
              <line
                x1="12"
                y1="1.5"
                x2="26.0357"
                y2="1.5"
                stroke="white"
                stroke-width="3"
              ></line>
            </svg>
            <svg className="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                fill="white"
                mask="url(#path-1-inside-1_8_19)"
              ></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="card-profesores">
        <label className="avatar"></label>
        <label className="info">
          <span className="info-1">Jorge Gonzalez Perez</span>
          <span className="info-2">645239745</span>
          <a className="info-3 email-link" href="mail:to">
            jgp19112003@gmail.com
          </a>
          <span className="info-4">Matemáticas</span>
        </label>
        <div className="boton-container">
          <button className="bin-button">
            <svg className="bin-top" viewBox="0 0 39 7" fill="none">
              <line
                y1="5"
                x2="39"
                y2="5"
                stroke="white"
                stroke-width="4"
              ></line>
              <line
                x1="12"
                y1="1.5"
                x2="26.0357"
                y2="1.5"
                stroke="white"
                stroke-width="3"
              ></line>
            </svg>
            <svg className="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                fill="white"
                mask="url(#path-1-inside-1_8_19)"
              ></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="card-profesores">
        <label className="avatar"></label>
        <label className="info">
          <span className="info-1">Jorge Gonzalez Perez</span>
          <span className="info-2">645239745</span>
          <a className="info-3 email-link" href="mail:to">
            jgp19112003@gmail.com
          </a>
          <span className="info-4">Matemáticas</span>
        </label>
        <div className="boton-container">
          <button className="bin-button">
            <svg className="bin-top" viewBox="0 0 39 7" fill="none">
              <line
                y1="5"
                x2="39"
                y2="5"
                stroke="white"
                stroke-width="4"
              ></line>
              <line
                x1="12"
                y1="1.5"
                x2="26.0357"
                y2="1.5"
                stroke="white"
                stroke-width="3"
              ></line>
            </svg>
            <svg className="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                fill="white"
                mask="url(#path-1-inside-1_8_19)"
              ></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="card-profesores">
        <label className="avatar"></label>
        <label className="info">
          <span className="info-1">Jorge Gonzalez Perez</span>
          <span className="info-2">645239745</span>
          <a className="info-3 email-link" href="mail:to">
            jgp19112003@gmail.com
          </a>
          <span className="info-4">Matemáticas</span>
        </label>
        <div className="boton-container">
          <button className="bin-button">
            <svg className="bin-top" viewBox="0 0 39 7" fill="none">
              <line
                y1="5"
                x2="39"
                y2="5"
                stroke="white"
                stroke-width="4"
              ></line>
              <line
                x1="12"
                y1="1.5"
                x2="26.0357"
                y2="1.5"
                stroke="white"
                stroke-width="3"
              ></line>
            </svg>
            <svg className="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                fill="white"
                mask="url(#path-1-inside-1_8_19)"
              ></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
