// server/controllers/productController.js
import pool from '../db.js';

export const getFeaturedProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.nombre_producto AS name,
        p.precio AS price,
        p.costo AS originalPrice,
        p.imagen_producto AS image,
        p.calificacion AS rating,
        COALESCE(r.review_count, 0) AS reviews,
        p.vendidos AS sold
      FROM productos p
      LEFT JOIN (
        SELECT producto, COUNT(*) as review_count
        FROM resenas
        GROUP BY producto
      ) r ON p.id = r.producto
      WHERE p.existencias > 0
      ORDER BY p.vendidos DESC
      LIMIT 8
    `);

    // Convert bytea image to base64 if exists
    const products = result.rows.map(product => ({
      ...product,
      image: product.image ? product.image.toString('base64') : null
    }));

    res.json({
      success: true,
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los productos'
    });
  }
};

export const getFlashDealProducts = async (req, res) => {
  const targetDate = '2025-04-25'; // Use your test date
  
  try {
    console.log(`Fetching flash deals for date: ${targetDate}`);
    
    // Corrected query with proper parentheses
    const result = await pool.query(`
      SELECT 
        p.id,
        p.nombre_producto AS name,
        p.precio AS price,
        p.costo AS original_price,
        p.calificacion AS rating,
        hv.cant_ventas AS sold_today,
        ROUND((p.precio - p.costo) / p.precio * 100) AS discount_percent
      FROM productos p
      JOIN historia_ventas hv ON p.id = hv.producto
      WHERE hv.fecha = $1
      AND p.existencias > 0
      ORDER BY hv.cant_ventas DESC
      LIMIT 4
    `, [targetDate]);

    console.log(`Found ${result.rowCount} flash deals`);

    // Process the results
    const products = result.rows.map(product => ({
      ...product,
      deal_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));

    return res.json({ success: true, products });

  } catch (err) {
    console.error('Detailed error:', {
      message: err.message,
      query: err.query, // The exact failed query
      stack: err.stack
    });
    
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre_categoria AS name
      FROM categorias
      ORDER BY name
    `);

    res.json({
      success: true,
      categories: result.rows
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las categorías'
    });
  }
};