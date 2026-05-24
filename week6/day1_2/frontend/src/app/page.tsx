'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/shared/ProductCard';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// ─── Hero Section ───────────────────────────────────────────
function HeroSection() {
  return (
    <section className="bg-[url('/assets/hero-img.png')] bg-center bg-cover bg-no-repeat overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[480px] sm:min-h-[600px] flex flex-col lg:flex-row items-center relative">
        {/* Left content */}
        <div className="pt-12 pb-8 lg:py-20 flex-1 max-w-xl z-10">
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-[64px] leading-none tracking-tight">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="mt-5 text-gray-500 text-sm sm:text-base leading-relaxed max-w-md">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Shop Now
          </Link>
          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-6 sm:gap-10">
            {[
              { value: '200+', label: 'International Brands' },
              { value: '2,000+', label: 'High-Quality Products' },
              { value: '30,000+', label: 'Happy Customers' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-integral text-2xl sm:text-3xl font-black">{stat.value}</span>
                <span className="text-gray-400 text-xs sm:text-sm mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right hero image */}
        <div className="flex-1 w-full lg:w-1/2 relative min-h-[400px] sm:min-h-[500px] lg:min-h-0 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 flex items-end justify-center overflow-hidden">
          {/* Star decorations */}
          <div className="absolute z-10 top-10 right-4 lg:right-24 text-8xl  select-none">✦</div>
          <div className="absolute z-10 top-1/3 left-4 lg:left-8 text-5xl  select-none">✦</div>

        </div>
      </div>
    </section>
  );
}

// ─── Brands Strip ───────────────────────────────────────────
function BrandsStrip() {
  const brands = [
    { src: '/brand_logos/Group.png', alt: 'Versace' },
    { src: '/brand_logos/zara-logo-1 1.png', alt: 'Zara' },
    { src: '/brand_logos/gucci-logo-1 1.png', alt: 'Gucci' },
    { src: '/brand_logos/prada-logo-1 1.png', alt: 'Prada' },
    { src: '/brand_logos/Group-1.png', alt: 'Calvin Klein' },
  ];
  return (
    <section className="bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-8 md:gap-10">
          {brands.map((brand, i) => (
            <div key={i} className="relative h-6 sm:h-8 lg:h-9 w-24 sm:w-32 lg:w-40 opacity-90 hover:opacity-100 transition-opacity">
              <Image src={brand.src} alt={brand.alt} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section Header ─────────────────────────────────────────
function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="font-integral text-2xl sm:text-3xl lg:text-4xl font-black text-center flex-1">{title}</h2>
      <Link
        href={href}
        className="hidden sm:inline-flex items-center gap-1 border border-gray-300 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex-shrink-0"
      >
        View All
      </Link>
    </div>
  );
}

// ─── Products Section ───────────────────────────────────────
function ProductsSection({ title, href, queryFn }: { title: string; href: string; queryFn: () => Promise<any> }) {
  const { data, isLoading } = useQuery({ queryKey: [title], queryFn });
  const products: Product[] = data?.data || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={title} href={href} />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))
          : products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
      <div className="sm:hidden text-center mt-8">
        <Link href={href} className="inline-flex border border-gray-300 px-8 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          View All
        </Link>
      </div>
    </section>
  );
}

// ─── Browse By Style ─────────────────────────────────────────
function BrowseByStyle() {
  const styles = [
    { label: 'Casual', img: '/assets/casual.png', href: '/shop?style=Casual' },
    { label: 'Formal', img: '/assets/formal.png', href: '/shop?style=Formal' },
    { label: 'Party', img: '/assets/party.png', href: '/shop?style=Party' },
    { label: 'Gym', img: '/assets/gym.png', href: '/shop?style=Gym' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#F0F0F0] rounded-3xl p-6 sm:p-10">
        <h2 className=" text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-8">
          BROWSE BY DRESS STYLE
        </h2>
        <div className="grid grid-cols-5 gap-4 auto-rows-[200px] sm:auto-rows-[250px]">
          {styles.map((style, index) => {
            // First row: 20% (col-span-1) and 80% (col-span-4)
            // Second row: 80% (col-span-4) and 20% (col-span-1)
            const isFirstInPair = index % 2 === 0;
            const rowNumber = Math.floor(index / 2);

            let colSpan;
            if (rowNumber % 2 === 0) {
              // Even rows (0, 2, 4...): first item 20%, second item 80%
              colSpan = isFirstInPair ? "col-span-2" : "col-span-3";
            } else {
              // Odd rows (1, 3, 5...): first item 80%, second item 20%
              colSpan = isFirstInPair ? "col-span-3" : "col-span-2";
            }

            return (
              <Link
                key={style.label}
                href={style.href}
                className={`${colSpan} relative rounded-2xl overflow-hidden group cursor-pointer`}
              >
                <Image
                  src={style.img}
                  alt={style.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <span className="absolute top-4 left-4 font-integral font-black text-black text-lg sm:text-xl">
                  {style.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────
const testimonials = [
  { name: 'Sarah M.', text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { name: 'Alex K.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shopco. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
  { name: 'James L.', text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shopco. The selection of clothes is not only diverse but also on-point with the latest trends!" },
  { name: 'Mose T.', text: "The quality is unmatched. Every item I've ordered has been exactly as described, and the customer service team is incredibly helpful. Highly recommend!" },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-integral text-2xl sm:text-3xl lg:text-4xl font-black">OUR HAPPY CUSTOMERS</h2>
        <div className="flex gap-2">
          <button onClick={() => setActive((p) => (p - 1 + testimonials.length) % testimonials.length)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ArrowLeft size={14} />
          </button>
          <button onClick={() => setActive((p) => (p + 1) % testimonials.length)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.slice(active % testimonials.length, active % testimonials.length + 3).concat(testimonials).slice(0, 3).map((t, i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-6">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#FFC633"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-sm">{t.name}</span>
              <span className="text-green-500 text-xs">✓</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">"{t.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Need to explicitly import useState for Testimonials
import { useState } from 'react';

// ─── Homepage ────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandsStrip />
      <div className="border-b border-gray-100">
        <ProductsSection
          title="NEW ARRIVALS"
          href="/shop?arrivals=true"
          queryFn={productsApi.getNewArrivals}
        />
      </div>
      <div className="border-b border-gray-100">
        <ProductsSection
          title="TOP SELLING"
          href="/shop?top=true"
          queryFn={productsApi.getTopSelling}
        />
      </div>
      <BrowseByStyle />
      <Testimonials />
    </>
  );
}
