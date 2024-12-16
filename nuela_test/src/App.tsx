import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Inicio from "./components/Inicio";
import Horarios from "./components/Horarios";
import Profesores from "./components/Profesores";
import { Espacios } from "./components/Espacios";
import Alumnos from "./components/Alumnos";
import Notificaciones from "./components/Notificaciones";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/horarios" element={<Horarios />} />
        <Route path="/profesores" element={<Profesores />} />
        <Route path="/espacios" element={<Espacios />} />
        <Route path="/alumnos" element={<Alumnos />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
      </Routes>
    </div>
  );
}

export default App;
