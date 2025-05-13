// src/services/cartService.js
export const addItemToCart = async (productId, quantity = 1, token) => {
  try {
    const response = await fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // importante
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error('Error al añadir al carrito');
    }

    return await response.json();
  } catch (err) {
    console.error('Error en addItemToCart:', err);
    return { success: false, error: err.message };
  }
};