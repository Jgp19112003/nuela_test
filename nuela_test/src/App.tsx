import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Inicio from "./components/Inicio";
import Horarios from "./components/Horarios";
import Profesores from "./components/Profesores";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/horarios" element={<Horarios />} />
        <Route path="/profesores" element={<Profesores />} />
      </Routes>
    </div>
  );
}

export default App;
