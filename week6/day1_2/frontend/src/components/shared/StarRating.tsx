'use client';
import { getStarArray } from '@/lib/utils';

interface Props {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
}

const sizes = { sm: 12, md: 16, lg: 20 };

export default function StarRating({ rating, size = 'md', showValue = false, count }: Props) {
  const stars = getStarArray(rating);
  const px = sizes[size];
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <svg key={i} width={px} height={px} viewBox="0 0 24 24" fill="none">
            {type === 'full' && (
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFC633" stroke="#FFC633" strokeWidth="1" />
            )}
            {type === 'half' && (
              <>
                <defs>
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor="#FFC633" />
                    <stop offset="50%" stopColor="#E0E0E0" />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#half-${i})`} stroke="#FFC633" strokeWidth="1" />
              </>
            )}
            {type === 'empty' && (
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E0E0E0" stroke="#E0E0E0" strokeWidth="1" />
            )}
          </svg>
        ))}
      </div>
      {(showValue || count !== undefined) && (
        <span className="text-xs text-gray-500 ml-1">
          {showValue && <span className="font-medium text-black">{rating}</span>}
          {showValue && <span>/5</span>}
          {count !== undefined && <span className="ml-1">({count})</span>}
        </span>
      )}
    </div>
  );
}
