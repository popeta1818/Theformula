// server/controllers/cartController.js
import pool from '../db.js';

export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    // Get cart with items from carrito_compras
    const cartQuery = await pool.query(
      `SELECT c.id, c.usuario_id, c.fecha_creacion, 
       ci.id as item_id, ci.producto_id, ci.cantidad, ci.precio,
       p.nombre as producto_nombre, p.imagen as producto_imagen
       FROM carrito_compras c
       LEFT JOIN carrito_items ci ON c.id = ci.carrito_id
       LEFT JOIN productos p ON ci.producto_id = p.id
       WHERE c.usuario_id = $1`,
      [userId]
    );

    if (cartQuery.rows.length === 0) {
      // Create a new cart if none exists
      const newCart = await pool.query(
        'INSERT INTO carrito_compras (usuario_id) VALUES ($1) RETURNING *',
        [userId]
      );
      return res.json({ items: [], coupon: null });
    }

    // Format the cart data
    const cart = {
      id: cartQuery.rows[0].id,
      items: cartQuery.rows
        .filter(row => row.item_id) // Only rows with items
        .map(item => ({
          id: item.item_id,
          product: {
            id: item.producto_id,
            name: item.producto_nombre,
            image: item.producto_imagen,
          },
          quantity: item.cantidad,
          price: item.precio,
        })),
      coupon: null,
    };

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    // Get or create cart
    let cart = await pool.query(
      'SELECT id FROM carrito_compras WHERE usuario_id = $1',
      [userId]
    );

    if (cart.rows.length === 0) {
      cart = await pool.query(
        'INSERT INTO carrito_compras (usuario_id) VALUES ($1) RETURNING id',
        [userId]
      );
    }
    const cartId = cart.rows[0].id;

    // Get product details from productos table
    const product = await pool.query(
      'SELECT precio, nombre, imagen FROM productos WHERE id = $1',
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Check if product already in cart
    const existingItem = await pool.query(
      'SELECT id, cantidad FROM carrito_items WHERE carrito_id = $1 AND producto_id = $2',
      [cartId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].cantidad + quantity;
      await pool.query(
        'UPDATE carrito_items SET cantidad = $1 WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Add new item
      await pool.query(
        `INSERT INTO carrito_items 
        (carrito_id, producto_id, cantidad, precio) 
        VALUES ($1, $2, $3, $4)`,
        [cartId, productId, quantity, product.rows[0].precio]
      );
    }

    // Return updated cart
    const updatedCart = await pool.query(
      `SELECT ci.id, ci.producto_id, ci.cantidad, ci.precio,
       p.nombre, p.imagen
       FROM carrito_items ci
       JOIN productos p ON ci.producto_id = p.id
       WHERE ci.carrito_id = $1`,
      [cartId]
    );

    res.json({
      items: updatedCart.rows.map(item => ({
        id: item.id,
        product: {
          id: item.producto_id,
          name: item.nombre,
          image: item.imagen,
        },
        quantity: item.cantidad,
        price: item.precio,
      })),
      coupon: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    // Verify the item belongs to user's cart
    const itemCheck = await pool.query(
      `SELECT ci.id FROM carrito_items ci
       JOIN carrito_compras c ON ci.carrito_id = c.id
       WHERE ci.id = $1 AND c.usuario_id = $2`,
      [itemId, userId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
    }

    if (quantity < 1) {
      // Remove item if quantity is 0
      await pool.query(
        'DELETE FROM carrito_items WHERE id = $1',
        [itemId]
      );
    } else {
      // Update quantity
      await pool.query(
        'UPDATE carrito_items SET cantidad = $1 WHERE id = $2',
        [quantity, itemId]
      );
    }

    // Return updated cart
    const cart = await pool.query(
      `SELECT c.id FROM carrito_compras c WHERE c.usuario_id = $1`,
      [userId]
    );
    
    const updatedCart = await pool.query(
      `SELECT ci.id, ci.producto_id, ci.cantidad, ci.precio,
       p.nombre, p.imagen
       FROM carrito_items ci
       JOIN productos p ON ci.producto_id = p.id
       WHERE ci.carrito_id = $1`,
      [cart.rows[0].id]
    );

    res.json({
      items: updatedCart.rows.map(item => ({
        id: item.id,
        product: {
          id: item.producto_id,
          name: item.nombre,
          image: item.imagen,
        },
        quantity: item.cantidad,
        price: item.precio,
      })),
      coupon: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  try {
    // Verify the item belongs to user's cart
    const itemCheck = await pool.query(
      `SELECT ci.id FROM carrito_items ci
       JOIN carrito_compras c ON ci.carrito_id = c.id
       WHERE ci.id = $1 AND c.usuario_id = $2`,
      [itemId, userId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
    }

    await pool.query(
      'DELETE FROM carrito_items WHERE id = $1',
      [itemId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user's cart
    const cart = await pool.query(
      'SELECT id FROM carrito_compras WHERE usuario_id = $1',
      [userId]
    );

    if (cart.rows.length > 0) {
      // Delete all items from cart
      await pool.query(
        'DELETE FROM carrito_items WHERE carrito_id = $1',
        [cart.rows[0].id]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};