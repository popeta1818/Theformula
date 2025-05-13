import dbPromise from '../db.js';
import jwt from 'jsonwebtoken';

// ✅ Registro de usuario (sin hash)
export const registerUser = async (req, res) => {
  const { nombre, apellido, correo, telefono, contrasena } = req.body;

  try {
    const db = await dbPromise;

    const result = await db.run(
      `INSERT INTO usuarios (nombre, apellido, correo, telefono, contraseña)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, telefono, contrasena]
    );

    const user = await db.get(
      `SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?`,
      result.lastID
    );

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ✅ Login con verificación simple + token JWT
export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const db = await dbPromise;
    const user = await db.get(
      `SELECT id, nombre, correo, contraseña, rol FROM usuarios WHERE correo = ?`,
      [correo]
    );

    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuario no encontrado' });
    }

    if (contrasena !== user.contraseña) {
      return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, 'secreto_super_seguro', {
      expiresIn: '1d',
    });

    delete user.contraseña;

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};

// ✅ Crear admin manualmente
export const crearAdmin = async (req, res) => {
  try {
    const db = await dbPromise;

    const correoUnico = `admin${Date.now()}@theformula.com`;
    const contrasena = 'admin123';

    await db.run(
      `INSERT INTO usuarios (nombre, apellido, correo, telefono, contraseña, rol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Admin', 'Prueba', correoUnico, '0000000000', contrasena, 'admin']
    );

    res.status(201).json({
      success: true,
      message: 'Admin creado correctamente',
      correo: correoUnico,
    });
  } catch (err) {
    console.error('Error al crear admin:', err);
    res.status(500).json({ error: 'Error en el servidor al crear admin' });
  }
};
