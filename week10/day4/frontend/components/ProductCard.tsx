'use client';

import { Product } from './types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card" role="article" aria-label={product.name}>
      <p className="product-card-category">{product.category}</p>
      <p className="product-card-name">{product.name}</p>
      <p className="product-card-desc">{product.description}</p>
      <div className="product-card-footer">
        <span className="product-card-price">£{product.price.toFixed(2)}</span>
        {product.inStock && (
          <span className="product-card-stock">✓ In Stock</span>
        )}
      </div>
      {product.dosage && (
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', position: 'relative' }}>
          💊 {product.dosage}
        </p>
      )}
    </div>
  );
}
