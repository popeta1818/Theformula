import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import busqueda from '../assets/busqueda.png';
import corazon from '../assets/corazon.png';
import carrito from '../assets/carrito.png';
import usuario from '../assets/usuario.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Header() {
  const { user, logout } = useAuth();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef();

  const togglePanel = () => setShowPanel(prev => !prev);

  // Cierra el panel si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">THE FORMULA</div>
      <nav>
        <Link to="/">Inicio</Link>

        {!user && (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Regístrate</Link>
          </>
        )}

        {user?.rol === 'admin' && (
          <Link to="/admin">Panel de admin</Link>
        )}
      </nav>

      <div className="icons">
        <div className="search-container">
          <input type="text" placeholder="¿Qué estás buscando?" />
          <img src={busqueda} alt="Buscar" className="search-icon" />
        </div>
        <button><img src={corazon} alt="Favoritos" /></button>
        <button><img src={carrito} alt="Carrito" /></button>

        <div className="user-panel-container" ref={panelRef}>
          <button onClick={togglePanel}><img src={usuario} alt="Usuario" /></button>
          {showPanel && user && (
            <div className="user-panel">
              <p>Hola, {user.nombre}</p>
              <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
