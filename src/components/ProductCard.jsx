import React from 'react';
import { useCart } from '../context/CartContext'; // Import the cart hook
import './ProductCard.css';

const ProductCard = ({ product, isDeal = false }) => {
  const { addToCart } = useCart(); // Get the addToCart function from context

  const handleAddToCart = () => {
    // Create a clean product object for the cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      // Include any other necessary fields
    };
    console.log('Adding to cart:', cartProduct); // Debug log
    addToCart(cartProduct);
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