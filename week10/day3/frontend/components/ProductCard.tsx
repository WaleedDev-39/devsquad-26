'use client';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  return (
    <div className="product-card group">
      <div className="product-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
          }}
        />
        {product.inStock ? (
          <span className="badge badge-green">In Stock</span>
        ) : (
          <span className="badge badge-red">Out of Stock</span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-rating">
          <div className="stars">
            {stars.map((filled, i) => (
              <span key={i} className={filled ? 'star filled' : 'star'}>★</span>
            ))}
          </div>
          <span className="review-count">({product.reviewCount?.toLocaleString()})</span>
        </div>

        {product.benefits?.length > 0 && (
          <div className="product-benefits">
            {product.benefits.slice(0, 3).map((benefit, i) => (
              <span key={i} className="benefit-tag">✓ {benefit}</span>
            ))}
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span className="price-currency">{product.currency || 'USD'}</span>
            <span className="price-value">${product.price?.toFixed(2)}</span>
          </div>
          <button className="btn-add-cart" disabled={!product.inStock}>
            {product.inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
