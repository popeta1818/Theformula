import React from 'react';
import { addItemToCart } from '../services/cartService';
import { useAuth } from '../context/authContext';
import './ProductCard.css';

const ProductCard = ({ product, isDeal = false }) => {
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user || !user.token) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    try {
      const result = await addItemToCart(product.id, 1, user.token);
      if (result.items) {
        alert('✅ Producto añadido al carrito.');
      } else {
        alert('❌ Error al añadir al carrito: ' + result.error);
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      alert('❌ Ocurrió un error al intentar añadir al carrito.');
    }
  };

  return (
    <div className="product-card">
      {isDeal && (
        <div className="discount-badge">
          -{product.discountPercent}%
        </div>
      )}
      <div className="product-image-container">
        {product.image && (
          <img 
            src={product.image.startsWith('data:') ? product.image : product.image} 
            alt={product.name} 
            className="product-image"
          />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="price-container">
          <span className="current-price">${Number(product.price).toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="rating">
          {'★'.repeat(Math.round(product.rating || 0))}
          {product.reviews && ` (${product.reviews})`}
        </div>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
