'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import StarRating from '@/components/shared/StarRating';
import SaleBadge from '@/components/shared/SaleBadge';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const imgSrc = getImageUrl(product.images?.[0]) || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
  return (
    <Link href={`/products/${product._id}`} className="group block product-card">
      <div className="relative bg-[#F2F0F1] rounded-2xl overflow-hidden aspect-square mb-3">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.isOnSale && product.salePercent > 0 && (
          <div className="absolute top-3 left-3">
            <SaleBadge percent={product.salePercent} />
          </div>
        )}
        {product.purchaseType === 'points' && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            Points Only
          </div>
        )}
        {product.purchaseType === 'hybrid' && (
          <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Pay w/ Points
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-1 group-hover:underline">{product.name}</h3>
        <div className="mt-1 mb-2">
          <StarRating rating={product.rating} size="sm" showValue count={product.reviewCount} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
          )}
          {product.isOnSale && product.salePercent > 0 && <SaleBadge percent={product.salePercent} />}
        </div>
      </div>
    </Link>
  );
}
