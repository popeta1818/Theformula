import jwt from 'jsonwebtoken'; // Asegúrate de tenerlo instalado

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

    // ✅ Devuelve también el token
    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};
