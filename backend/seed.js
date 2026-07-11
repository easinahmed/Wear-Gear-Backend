const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

const CATEGORIES = [
  { name: 'Panjabi', image: '', description: 'Traditional elegance' },
  { name: 'Trouser', image: '', description: 'Comfort meets style' },
  { name: 'Polo Shirt', image: '', description: 'Classic casual' },
  { name: 'Sweatshirt', image: '', description: 'Winter essentials' },
  { name: 'Half-Shirt', image: '', description: 'Summer favorites' },
  { name: 'Hoodie', image: '', description: 'Urban style' },
];

const PRODUCTS = [
  {
    name: "Wear & Gear Men's Premium Panjabi - Royal Navy", price: 1650, originalPrice: 1850, discountBadge: 'New',
    description: 'Elegantly crafted traditional Panjabi with intricate thread work on the collar and cuffs.',
    category: 'panjabi', images: [], features: ['Premium Cotton Silk', 'Intricate Embroidery', 'Comfort Fit'], stock: 20,
  },
  {
    name: "Wear & Gear Men's Premium Panjabi - Ivory White", price: 1650,
    description: 'A classic white Panjabi made from high-quality cotton, perfect for any spiritual or cultural event.',
    category: 'panjabi', images: [], features: ['100% Breathable Cotton', 'Simple Collar', 'Classic Cut'], stock: 15,
  },
  {
    name: 'Wear & Gear Embroidered Panjabi - Charcoal', price: 1750, discountBadge: 'Best Seller',
    description: 'Modern silhouette Panjabi featuring contrast embroidery for a sharp look.',
    category: 'panjabi', images: [], features: ['Premium Blended Fabric', 'Mandarin Collar', 'Hidden Pockets'], stock: 10,
  },
  {
    name: 'Wear & Gear Premium Stripe Panjabi - Sage Green', price: 1550,
    description: 'A modern, premium light sage-green Panjabi with sophisticated vertical striped textures.',
    category: 'panjabi', images: [], features: ['Premium Lightweight Cotton', 'Elegant Vertical Stripes', 'Designer Fit'], stock: 18,
  },
  {
    name: 'Wear & Gear Active Jogger – Stripe Grey', price: 1180, originalPrice: 1190, discountBadge: '৳10 OFF',
    description: 'High-fashion premium grey active runner joggers with a unique calf-stripe motif.',
    category: 'trouser', images: [], features: ['Stretch Active Knit', 'Calf "Strong & Fearless" print', 'Flexible Jogger Fit'], stock: 15,
  },
  {
    name: 'Wear & Gear Tailored Chino Trouser - Mocha', price: 1190, originalPrice: 1350, discountBadge: '12% OFF',
    description: 'Premium mocha brown chino with high-comfort stretchable cotton-twill fabric.',
    category: 'trouser', images: [], features: ['Comfort Stretch Cotton Twill', 'Reinforced Pockets', 'Elegant Mocha Finish'], stock: 12,
  },
  {
    name: 'Wear & Gear Commando Cargo Jogger - Blue', price: 1290,
    description: 'Urban streetwear active trousers in dusty royal-blue with military-grade flap pockets.',
    category: 'trouser', images: [], features: ['Dusty Active Blue Blend', 'Commando Side Utility Pockets', 'Adjustable Cuffed Cords'], stock: 10,
  },
  {
    name: 'Wear & Gear Commando Cargo Jogger - Tan', price: 1350,
    description: 'Rugged yet ultra-stylish cargo trousers with smart-cargo side storage.',
    category: 'trouser', images: [], features: ['Durable Active Cotton-Poly', 'Dual Zipped Accent Pockets', 'COMMANDO signature detail'], stock: 16,
  },
  {
    name: 'Wear & Gear Contrast Collar Polo - White', price: 1350, originalPrice: 1450, discountBadge: '৳100 OFF',
    description: 'High-end white polo featuring stylish black and steel-blue contrast collar tipping.',
    category: 'polo-shirt', images: [], features: ['100% Combed Pique Cotton', 'Black & Steel-Blue Collar Detail', 'Regular Premium Fit'], stock: 25,
  },
  {
    name: 'Wear & Gear Premium Pique Polo - Navy Blue', price: 1500,
    description: 'Premium quality pique polo in rich navy blue with fine white tipping.',
    category: 'polo-shirt', images: [], features: ['Honeycomb Comfort Knit', 'Fine Double Collar Tipping', 'Comfort Athletic Cut'], stock: 18,
  },
  {
    name: 'Wear & Gear Textured Knit Polo - Olive', price: 1050,
    description: 'Stunning textured olive green knit polo shirt with stylish dark-tone buttons.',
    category: 'polo-shirt', images: [], features: ['Premium Cotton Giza blend', 'Unique Olive Texture Way', 'Sleek Black Buttons detail'], stock: 22,
  },
  {
    name: 'Wear & Gear Luxury Classic Polo - Burgundy', price: 1100,
    description: 'Luxurious burgundy maroon fitted polo shirt accented by subtle dark charcoal collar details.',
    category: 'polo-shirt', images: [], features: ['100% Egyptian Combed Weave', 'Accent Deep Charcoal Borders', 'Fitted Casual Premium drape'], stock: 30,
  },
  {
    name: 'Wear & Gear Heritage Sweatshirt - Navy Blue', price: 1150,
    description: 'Premium heritage active crewneck sweatshirt with rich loopback fleece.',
    category: 'sweatshirt', images: [], features: ['Premium Heavy Cotton Fleece', 'Double-Needle Ribbed Trim', 'Rich Royal Navy Shade'], stock: 30,
  },
  {
    name: 'Wear & Gear Minimalist Streetwear Crew - Navy', price: 1250,
    description: 'Modern relaxed oversized fit with clean dropped shoulders in deeply pigmented navy.',
    category: 'sweatshirt', images: [], features: ['Breathable Core Loopback', 'Contemporary Dropped Shoulders', 'Super-Soft Minimalist Silhouette'], stock: 15,
  },
  {
    name: 'Wear & Gear Premium Cozy Hoodie - White', price: 1850, discountBadge: 'Cozy Winter',
    description: 'Luxurious premium white pullover fleece hoodie with thick loopback warmth.',
    category: 'hoodie', images: [], features: ['100% Cotton Fleece Lined', 'Comfort Drawstrings Detail', 'Premium Standard Drop Shoulder'], stock: 14,
  },
  {
    name: 'Wear & Gear "Another Dimension" Hoodie', price: 1850, originalPrice: 2200, discountBadge: 'Street Style',
    description: 'Premium heavy-fleece pullover hoodie in organic olive-green with typography print.',
    category: 'hoodie', images: [], features: ['Organic Olive Green Weave', 'ANOTHER DIMENSION Print Detail', 'Cozy Warm Heavy Fleece Lining'], stock: 10,
  },
  {
    name: 'Wear & Gear Premium Vertical Striped - Teal Green', price: 1450, originalPrice: 1650, discountBadge: 'PREMIUM',
    description: 'Premium vertical-striped casual short-sleeve button-down shirt in teal-green.',
    category: 'half-shirt', images: [], features: ['Premium Cotton-Linen Blend', 'Teal Green & White Pinstripes', 'Relaxed Breathable Fit'], stock: 14,
  },
  {
    name: 'Wear & Gear Classic Resort Stripe - Ocean Blue', price: 1350, discountBadge: 'HOT',
    description: 'Classic resort-style vertical stripe half-shirt in refreshing ocean blue.',
    category: 'half-shirt', images: [], features: ['Lightweight Comfort Weave', 'Classic Casual Spread Collar', 'Elegant Chest Pocket Accent'], stock: 18,
  },
  {
    name: 'Wear & Gear Luxury Pinstripe - Terracotta', price: 1550, originalPrice: 1750, discountBadge: 'TRENDING',
    description: 'Exquisitely textured casual half-shirt with luxury vertical pinstripes in warm terracotta.',
    category: 'half-shirt', images: [], features: ['Mercerized Cotton Blend', 'Sophisticated Clean Pinstripes', 'Premium Matching Closures'], stock: 12,
  },
  {
    name: 'Wear & Gear Minimalist Casual - Silver Grey', price: 1250, discountBadge: 'SUMMER COOL',
    description: 'Ultra-soft casual half-shirt in cool silver grey with premium structured cotton.',
    category: 'half-shirt', images: [], features: ['Ultra-Soft Brushed Finish', 'Calming Silver Grey Tone', 'Reinforced Durable Hems'], stock: 20,
  },
  {
    name: 'Wear & Gear Performance Tech Polo', price: 1450,
    description: 'Engineered for the active lifestyle, this premium forest-green designer polo.',
    category: 'polo-shirt', images: [], features: ['Active Quick Dry Technology', 'White Collar Tipping', 'Premium Comfortable Stretch'], stock: 12,
  },
  {
    name: 'Wear & Gear Minimalist Streetwear Hoodie - Chestnut Brown', price: 1950, originalPrice: 2400, discountBadge: 'Essential',
    description: 'Minimalist street-style drawstring pullover hoodie in warm chestnut brown.',
    category: 'hoodie', images: [], features: ['Trendy Warm Chestnut Tone', 'Premium Metal Tip Aglets', 'Boxy Streetwear Drop Shoulder Silhouette'], stock: 8,
  },
  {
    name: 'Wear & Gear Active Jogger - Olive Green', price: 1550, originalPrice: 1750, discountBadge: 'SALE',
    description: 'Premium forest olive-green slim-fit active jogger trouser.',
    category: 'trouser', images: [], features: ['Breathable Active Knit', 'Elastic Drawstring Waist', 'Secure Side Zip Pockets'], stock: 14,
  },
  {
    name: 'Wear & Gear Teal Chevron Panjabi', price: 2450, originalPrice: 2855, discountBadge: 'Premium',
    description: 'Elegant steel-blue designer Panjabi with zigzag chevron texture.',
    category: 'panjabi', images: [], features: ['Zigzag Chevron Texture', 'Premium Cotton-Silk Blend', 'Bespoke Fit'], stock: 5,
  },
  {
    name: 'Wear & Gear Festive Checked Panjabi - Purple', price: 1550,
    description: 'Premium designer purple and grey checked pattern cotton Panjabi.',
    category: 'panjabi', images: [], features: ['100% Breathable Cotton', 'Checked/Plaid Texture', 'Classic Fitting'], stock: 12,
  },
  {
    name: 'Wear & Gear Geometric Tile Printed Panjabi - Grey', price: 1680,
    description: 'High-end grey designer Panjabi with geometric floral tile print.',
    category: 'panjabi', images: [], features: ['Delicate Floral Print', 'Embroidered Collar & Placket', 'Modern Fit'], stock: 10,
  },
  {
    name: 'Wear & Gear Charcoal Striped Panjabi', price: 1850, discountBadge: 'Trending',
    description: 'Elegant charcoal black pinstriped designer Panjabi with refined geometric embroidery.',
    category: 'panjabi', images: [], features: ['Charcoal Pinstripes', 'Refined Geometric Borders', 'Signature Luxury Finish'], stock: 8,
  },
  {
    name: 'Wear & Gear Commando Cargo - Cream', price: 1150,
    description: 'Premium cream sand-beige cargo active trousers with military pocket detailing.',
    category: 'trouser', images: [], features: ['Cream Sand Cotton', 'Utilitarian Cargo Zips', 'COMMANDO detailing'], stock: 20,
  },
  {
    name: 'Wear & Gear Commando Jogger - Black', price: 1850,
    description: 'Sleek coal black active sports cuffed jogger with COMMANDO print.',
    category: 'trouser', images: [], features: ['Athletic Slim Fit', 'COMMANDO printed motif', 'Moisture Wicking Structure'], stock: 15,
  },
  {
    name: 'Wear & Gear Commando Cargo - Blue', price: 1950,
    description: 'Urban streetwear active trousers in dusty royal-blue with military-grade pockets.',
    category: 'trouser', images: [], features: ['Dusty Active Blue Blend', 'Commando Side Utility Pockets', 'Adjustable Cuffed Cords'], stock: 12,
  },
  {
    name: 'Wear & Gear Summer Breeze Shirt - Light Grey', price: 950,
    description: 'Super lightweight breathable short-sleeve button-down casual shirt in silver grey.',
    category: 'polo-shirt', images: [], features: ['Ultra-Light Silver Cotton', 'Breathable Material', 'Stylishly Unbuttoned Collar'], stock: 25,
  },
  {
    name: 'Wear & Gear Classic Polo - Pastel Lavender', price: 1250,
    description: 'Pastel lavender purple polo in premium combed-cotton for summer comfort.',
    category: 'polo-shirt', images: [], features: ['Pastel Lavender Shade', 'Fitted Contemporary Silhouette', 'Soft Micro-Knit Weave'], stock: 14,
  },
  {
    name: 'Wear & Gear Luxury Pique Polo - Charcoal Grey', price: 1550,
    description: 'Formal charcoal grey polo with rich combed pique weave.',
    category: 'polo-shirt', images: [], features: ['Solid Charcoal Grey Hue', 'Premium Pique Structured Collar', 'Breathable Smart Active Frame'], stock: 10,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@wearandgear.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    const user = await User.create({
      name: 'Test User',
      email: 'user@wearandgear.com',
      password: 'user123',
      role: 'user',
    });
    console.log('User created:', user.email);

    const categories = await Category.insertMany(CATEGORIES);
    console.log(`${categories.length} categories seeded`);

    const products = await Product.insertMany(PRODUCTS);
    console.log(`${products.length} products seeded`);

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
