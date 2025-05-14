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

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error desde backend:', data);
      throw new Error(data.error || 'Error desconocido al añadir al carrito');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en addItemToCart:', err.message);
    return { success: false, error: err.message };
  }
};
