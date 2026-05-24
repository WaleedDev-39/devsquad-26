interface Props { percent: number; className?: string; }
export default function SaleBadge({ percent, className = '' }: Props) {
  return (
    <span className={`inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
      -{percent}%
    </span>
  );
}
