import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandLogo from '../assets/images/wear_gear_logo_1781729202575.jpg';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      {/* Top Footer */}
      <div className="max-w-[1440px] mx-auto px-4 py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2.5">
              <img 
                src={brandLogo} 
                alt="Wear & Gear Logo" 
                className="w-8 h-8 object-contain bg-white p-0.5 rounded-sm"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-black tracking-tighter text-white">WEAR & GEAR</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              WEAR & GEAR is a premium lifestyle brand based in Bangladesh, dedicated to bringing the finest quality Men's ethnic and casual wear to your wardrobe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a72.63,72.63,0,1,0,40.3,64.31V3.2H316a108,108,0,0,0,101.8,101.8v104.91A208.77,208.77,0,0,1,448,209.91Z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-400 text-xs hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="text-gray-400 text-xs hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/shop?category=panjabi" className="text-gray-400 text-xs hover:text-white transition-colors">Panjabi Collection</Link></li>
              <li><Link to="/contact" className="text-gray-400 text-xs hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Customer Care</h3>
            <ul className="space-y-4">
              <li><Link to="/shipping" className="text-gray-400 text-xs hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return" className="text-gray-400 text-xs hover:text-white transition-colors">Return & Refund</Link></li>
              <li><Link to="/terms" className="text-gray-400 text-xs hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 text-xs hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Store Location</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-xs">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Head Office: House-12, Road-2, Block-C, Banasree, Dhaka-1219, Bangladesh.</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-xs">
                <Phone size={16} className="flex-shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-xs">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@wearandgear.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/5 py-8">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} WEAR & GEAR. ALL RIGHTS RESERVED.
          </p>
       
        </div>
      </div>
    </footer>
  );
}
