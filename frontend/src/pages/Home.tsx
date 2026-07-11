import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Product, PRODUCTS as mockProducts, CATEGORIES as mockCategories } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Skeleton, ProductCardSkeleton } from '../components/Skeleton';
const bannerNew = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=800&fit=crop';
const midBannerLeft = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop';
const midBannerRight = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop';

interface ApiCategory {
  _id: string;
  name: string;
  image?: string;
  description?: string;

  id?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<unknown>('/products?limit=50').catch(() => ({ products: [] as Product[] })),
      api.get<ApiCategory[]>('/categories').catch(() => [] as ApiCategory[]),
    ])
      .then(([productsRes, categoriesData]) => {
        const rawProducts = Array.isArray(productsRes) ? productsRes : (productsRes as { products: Product[] }).products || [];
        const apiProducts = rawProducts as Product[];
        const apiCategories = categoriesData || [];
        setProducts(
          apiProducts.length > 0
            ? apiProducts.map((p: Product) => ({ ...p, id: p._id || p.id }))
            : mockProducts
        );
        setCategories(
          apiCategories.length > 0
            ? apiCategories
            : mockCategories.map(c => ({ _id: c.id, id: c.id, name: c.name, image: c.image, description: c.description }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const getProductsByCategory = (catName: string) =>
    products.filter(p => p.category.toLowerCase() === catName.toLowerCase()).slice(0, 8);

  return (
    <div className="bg-[#f5f5f5] space-y-12 pb-24">
      {/* Hero Banner Section */}
      <section className="relative h-[45vh] md:h-[70vh] overflow-hidden bg-[#121212]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-10"
        >
          <Link to="/shop" className="relative block w-full h-full">
            <img 
              src={bannerNew} 
              alt="New Style Collection"
              className="w-full h-full object-cover object-right md:object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-y-0 left-0 w-full md:w-[60%] lg:w-[50%] bg-gradient-to-r from-black via-black/90 to-transparent flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 text-white z-20">
              <span className="text-xs sm:text-sm uppercase tracking-[0.45em] font-extrabold text-white mb-2 sm:mb-3 md:mb-4">
                WEAR & GEAR
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight uppercase tracking-normal text-white leading-tight mb-2 sm:mb-4">
                Fashion <br />
                <span className="font-black text-white tracking-wider drop-shadow-lg text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Collection</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium tracking-wide max-w-sm mb-6 sm:mb-8 leading-relaxed">
                Discover stunning outfits at discounted rates.
              </p>
              <div>
                <span className="inline-block bg-white text-black text-xs md:text-sm font-black uppercase tracking-[0.2em] px-8 py-3.5 transition-all hover:bg-black hover:text-white duration-300 border border-white cursor-pointer shadow-md shadow-black/30">
                  Shop Now
                </span>
              </div>
              <span className="text-[10px] md:text-xs text-white/85 tracking-widest font-bold mt-4 md:mt-6 block hover:underline">
                @wear&amp;gear.shop
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Shop By Collection */}
      <section className="max-w-[1440px] mx-auto px-4">
        <div className="bg-white py-3 px-6 shadow-sm mb-6 flex justify-center">
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-black">Shop By Collection</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/2] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {categories.map((category) => (
              <Link key={category._id} to={`/shop?category=${category.name.toLowerCase()}`} className="group relative aspect-[3/2] overflow-hidden bg-gray-100">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-wider font-bold">{category.name}</div>
                )}
                <div className="absolute inset-x-0 bottom-2 text-center">
                  <span className="bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black shadow-sm">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Category Sections */}
      {loading ? (
        <section className="max-w-[1440px] mx-auto px-4">
          <div className="bg-white py-3 px-6 shadow-sm mb-6 flex justify-center">
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        categories.map((category) => {
          const catProducts = getProductsByCategory(category.name);
          if (catProducts.length === 0) return null;
          return (
            <section key={category._id} className="max-w-[1440px] mx-auto px-4">
              <div className="bg-white py-3 px-6 shadow-sm mb-6 flex justify-center">
                <h2 className="text-xs uppercase tracking-[0.3em] font-black text-black">{category.name}</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link to={`/shop?category=${category.name.toLowerCase()}`} className="btn-secondary px-12 py-3 text-[10px]">
                  Load More
                </Link>
              </div>
            </section>
          );
        })
      )}

      {/* Featured Products - fallback when category sections show nothing */}
      {!loading && products.length > 0 && categories.every(c => !getProductsByCategory(c.name).length) && (
        <section className="max-w-[1440px] mx-auto px-4">
          <div className="bg-white py-3 px-6 shadow-sm mb-6 flex justify-center">
            <h2 className="text-xs uppercase tracking-[0.3em] font-black text-black">Featured Products</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/shop" className="btn-secondary px-12 py-3 text-[10px]">
              View All
            </Link>
          </div>
        </section>
      )}

      {/* Mid-Page Banners */}
      <section className="max-w-[1440px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/shop" className="aspect-[16/9] overflow-hidden relative">
          <img 
            src={midBannerLeft} 
            alt="Fashion Selection" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            referrerPolicy="no-referrer"
          />
        </Link>
        <Link to="/shop" className="aspect-[16/9] overflow-hidden relative">
          <img 
            src={midBannerRight} 
            alt="Premium Collection" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            referrerPolicy="no-referrer"
          />
        </Link>
      </section>

      {/* About Section */}
      <section className="max-w-[1440px] mx-auto px-4 py-12">
        <div className="bg-white p-10 md:p-16 shadow-sm space-y-8">
          <div>
            <h2 className="text-[13px] font-black uppercase mb-4 tracking-wider text-black">ONLINE SHOPPING MADE EASY AT WEAR & GEAR</h2>
            <p className="text-[12px] leading-relaxed text-gray-600 font-medium">
              If you would like to experience the best of online shopping for men, women and kids in India, you are at the right place. WEAR & GEAR is the ultimate destination for fashion and lifestyle, being host to a wide array of merchandise including clothing, footwear, accessories, jewellery, personal care products and more. It is time to redefine your style statement with our treasure-trove of trendy items. Our online store brings you the latest in designer products straight out of fashion houses. You can shop online at WEAR & GEAR from the comfort of your home and get your favourites delivered right to your doorstep.
            </p>
          </div>
          
          <div>
            <h2 className="text-[13px] font-black uppercase mb-4 tracking-wider text-black">BEST ONLINE SHOPPING SITE IN BANGLADESH FOR FASHION</h2>
            <p className="text-[12px] leading-relaxed text-gray-600 font-medium">
              Be it clothing, footwear or accessories, WEAR & GEAR offers you the ideal combination of fashion and functionality for men, women and kids. You will realise that the sky is the limit when it comes to the types of outfits that you can purchase for different occasions.
            </p>
          </div>
        </div>

        {/* Find Us Section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-black text-black">Find Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-8 shadow-sm h-full">
              <h3 className="text-[14px] font-black text-black mb-3">Wear & Gear Out-let</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
                Nagar Plaza, Shop No-36, Ground Floor, Fulbaria - Gulistan, Dhaka, Bangladesh, 1000
              </p>
            </div>
            
            <div className="bg-white p-8 shadow-sm h-full">
              <h3 className="text-[14px] font-black text-black mb-3">Head Office</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
                আদর্শ নগর, রঘুনাথপুর, ফুতুল্লা, নারায়ণগঞ্জ
              </p>
            </div>

            <div className="bg-white p-8 shadow-sm h-full">
              <h3 className="text-[14px] font-black text-black mb-3">Factory</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
                1st Road , Adarsh Nagar, Ragunathpur, Fatullah , Narayanganj
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Black USP Bar */}
      <div className="bg-black text-white py-4 border-t border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center space-x-2">
            <span>Store Pickup</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Cash On Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}