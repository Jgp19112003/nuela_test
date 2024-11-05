import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../styles/ConfirmacionPopup.css";

interface ConfirmacionPopupProps {
  mensaje: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmacionPopup: React.FC<ConfirmacionPopupProps> = ({
  mensaje,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title>Confirmación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mensaje-confirmacion">{mensaje}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button className="btn-confirmar" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmacionPopup;
