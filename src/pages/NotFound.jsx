import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="breadcrumb">Home / 404 Error</div>
      <h1 className="notfound-title">404 Not Found</h1>
      <p className="notfound-message">
        Visitaste una página no encontrada. Regresa a la página de inicio
      </p>
      <button className="notfound-button" onClick={() => window.location.href = '/'}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default NotFound;