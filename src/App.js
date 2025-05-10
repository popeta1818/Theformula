import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AgregarProducto from './components/AgregarProducto';
import DetallesProducto from './components/DetallesProducto';
import Dimensiones from './components/Dimensiones';
import PasoMarca from './components/PasoMarca';
import Imagen from './components/Imagen';
import Final from './components/Final';
import ActualizarInventario from './components/ActualizarInventario';
import PanelAdmin from './pages/PanelAdmin';
import AdminRoute from './components/AdminRoute';
import Productos from './components/Productos';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

import AdminLayout from './components/AdminLayout';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />

      {/* Rutas protegidas del admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<PanelAdmin />} />
        <Route path="productos" element={<Productos />} />
        <Route path="agregar-producto" element={<AgregarProducto />} />
        <Route path="actualizar-inventario" element={<ActualizarInventario />} />
        <Route path="detalles" element={<DetallesProducto />} />
        <Route path="paso3" element={<Dimensiones />} />
        <Route path="PasoMarca" element={<PasoMarca />} />
        <Route path="Imagen" element={<Imagen />} />
        <Route path="Final" element={<Final />} />
      </Route>
    </Routes>
  );
}

export default App;
