import imagePanjabi from '../assets/images/premium_black_panjabi_model_1781729421896.jpg';
import imageGreyPanjabi from '../assets/images/gray_patterned_panjabi_model_1781729574828.jpg';
import imageSteelGreyPanjabi from '../assets/images/steel_grey_embroidered_panjabi_model_1781730205403.jpg';
import imageNavyPatternedPanjabi from '../assets/images/navy_patterned_panjabi_model_1781730222658.jpg';
import imageIvoryWhitePanjabi from '../assets/images/ivory_white_panjabi_model_1781730236761.jpg';
import imageSageGreenStripedPanjabi from '../assets/images/sage_green_striped_panjabi_model_1781730454272.jpg';
import imageTealChevronPanjabi from '../assets/images/teal_chevron_panjabi_1781731083675.jpg';
import imagePurpleCheckedPanjabi from '../assets/images/purple_checked_panjabi_1781731104332.jpg';
import imageGreyPatternedSwimPanjabi from '../assets/images/grey_patterned_swim_panjabi_1781731121687.jpg';
import imageCharcoalStripedPanjabi from '../assets/images/charcoal_striped_panjabi_1781731138473.jpg';
import imageMochaChinoTrouser from '../assets/images/mocha_chino_trouser_model_1781731383250.jpg';
import imageGreyStripeActiveTrouser from '../assets/images/grey_stripe_active_trouser_model_1781731656029.jpg';
import imageTanCommandoCargo from '../assets/images/tan_commando_cargo_model_1781731669908.jpg';
import imageBlueCommandoCargo from '../assets/images/blue_commando_cargo_model_1781731683733.jpg';
import imageSandActiveJogger from '../assets/images/sand_active_jogger_model_1781731696974.jpg';
import imageOliveGreenJogger from '../assets/images/olive_green_jogger_model_1781731816734.jpg';
import imageBlackCommandoJogger from '../assets/images/black_commando_jogger_model_1781731834169.jpg';
import imageCreamCargoYellowBg from '../assets/images/cream_cargo_yellow_bg_model_1781731852376.jpg';

// Polo Shirt Model Images
import imageWhiteContrastPolo from '../assets/images/white_contrast_polo_model_1781732210228.jpg';
import imageNavyPiquePolo from '../assets/images/navy_pique_polo_model_1781732225675.jpg';
import imageOliveTexturedPolo from '../assets/images/olive_textured_polo_model_1781732239280.jpg';
import imageBurgundyLuxuryPolo from '../assets/images/burgundy_luxury_polo_model_1781732253142.jpg';
import imageForestGreenPolo from '../assets/images/forest_green_polo_model_1781732604518.jpg';
import imageLightGreySummerShirt from '../assets/images/light_grey_summer_shirt_model_1781732618269.jpg';
import imageLavenderPolo from '../assets/images/lavender_polo_model_1781732633177.jpg';
import imageCharcoalGreyPolo from '../assets/images/charcoal_grey_polo_model_1781732650208.jpg';

// Hoodie Model Images
import imageWhiteHoodieModel from '../assets/images/white_hoodie_model_1781733529303.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  description: string;
  category: string;
  images: string[];
  features: string[];
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'panjabi',
    name: 'Panjabi',
    image: imagePanjabi,
    description: 'Traditional elegance'
  },
  {
    id: 'trouser',
    name: 'Trouser',
    image: imageMochaChinoTrouser,
    description: 'Comfort meets style'
  },
  {
    id: 'polo-shirt',
    name: 'Polo Shirt',
    image: imageWhiteContrastPolo,
    description: 'Classic casual'
  },
  {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
    description: 'Winter essentials'
  },
  {
    id: 'half-shirt',
    name: 'Half-Shirt',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
    description: 'Summer favorites'
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    image: imageWhiteHoodieModel,
    description: 'Urban style'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wear & Gear Men’s Premium Panjabi - Royal Navy',
    price: 1650,
    originalPrice: 1850,
    discountBadge: 'New',
    description: 'Elegantly crafted traditional Panjabi with intricate thread work on the collar and cuffs.',
    category: 'panjabi',
    images: [
      imageNavyPatternedPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Premium Cotton Silk', 'Intricate Embroidery', 'Comfort Fit'],
    stock: 20
  },
  {
    id: 'p2',
    name: 'Wear & Gear Men’s Premium Panjabi - Ivory White',
    price: 1650,
    description: 'A classic white Panjabi made from high-quality cotton, perfect for any spiritual or cultural event.',
    category: 'panjabi',
    images: [
      imageIvoryWhitePanjabi,
      'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['100% Breathable Cotton', 'Simple Collar', 'Classic Cut'],
    stock: 15
  },
  {
    id: 'p3',
    name: 'Wear & Gear Embroidered Panjabi - Charcoal',
    price: 1750,
    discountBadge: 'Best Seller',
    description: 'Modern silhouette Panjabi featuring contrast embroidery for a sharp look.',
    category: 'panjabi',
    images: [
      imageSteelGreyPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Premium Blended Fabric', 'Mandarin Collar', 'Hidden Pockets'],
    stock: 10
  },
  {
    id: 'p4',
    name: 'Wear & Gear Premium Stripe Panjabi - Sage Green',
    price: 1550,
    description: 'A modern, premium light sage-green Panjabi with sophisticated vertical striped textures, tailored for impeccable comfort.',
    category: 'panjabi',
    images: [
      imageSageGreenStripedPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Premium Lightweight Cotton', 'Elegant Vertical Stripes', 'Designer Fit'],
    stock: 18
  },
  {
    id: 't1',
    name: 'Wear & Gear Active Jogger – Stripe Grey',
    price: 1180,
    originalPrice: 1190,
    discountBadge: '৳10 OFF',
    description: 'High-fashion premium grey active runner joggers with a unique calf-stripe motif reading "STRONG AND FEARLESS". Crafted with modern stretch knit-mesh panels.',
    category: 'trouser',
    images: [
      imageGreyStripeActiveTrouser,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Stretch Active Knit', 'Calf "Strong & Fearless" print', 'Flexible Jogger Fit'],
    stock: 15
  },
  {
    id: 't2',
    name: 'Wear & Gear Tailored Chino Trouser - Mocha',
    price: 1190,
    originalPrice: 1350,
    discountBadge: '12% OFF',
    description: 'Our signature tailored chino in a premium mocha brown shade, crafted with high-comfort stretchable cotton-twill fabric and reinforced stitching.',
    category: 'trouser',
    images: [
      imageMochaChinoTrouser,
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1624371414361-e6e0efc5831f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Comfort Stretch Cotton Twill', 'Reinforced Pockets', 'Elegant Mocha Finish'],
    stock: 12
  },
  {
    id: 't3',
    name: 'Wear & Gear Commando Cargo Jogger - Blue',
    price: 1290,
    description: 'Urban streetwear active trousers in dusty royal-blue, with military-grade flap pockets, cargo webbing, and custom drawstring waistband.',
    category: 'trouser',
    images: [
      imageBlueCommandoCargo,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Dusty Active Blue Blend', 'Commando Side Utility Pockets', 'Adjustable Cuffed Cords'],
    stock: 10
  },
  {
    id: 't4',
    name: 'Wear & Gear Commando Cargo Jogger - Tan',
    price: 1350,
    description: 'Rugged yet ultra-stylish cargo trousers offering smart-cargo side storage, durable black zippers, and a "COMMANDO" text signature on the side pocket flap.',
    category: 'trouser',
    images: [
      imageTanCommandoCargo,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Durable Active Cotton-Poly', 'Dual Zipped Accent Pockets', 'COMMANDO signature detail'],
    stock: 16
  },
  {
    id: 'po1',
    name: 'Wear & Gear Contrast Collar Polo - White',
    price: 1350,
    originalPrice: 1450,
    discountBadge: '৳100 OFF',
    description: 'Our signature high-end white polo featuring stylish black and steel-blue contrast collar tipping on snug textured pique cotton fabric.',
    category: 'polo-shirt',
    images: [
      imageWhiteContrastPolo,
      imageNavyPiquePolo,
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['100% Combed Pique Cotton', 'Black & Steel-Blue Collar Detail', 'Regular Premium Fit'],
    stock: 25
  },
  {
    id: 'po2',
    name: 'Wear & Gear Premium Pique Polo - Navy Blue',
    price: 1500,
    description: 'Premium quality pique polo in rich navy blue, featuring fine white tipping on the ribbed collar and an elegant chest crest embroidery.',
    category: 'polo-shirt',
    images: [
      imageNavyPiquePolo,
      imageWhiteContrastPolo,
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Honeycomb Comfort Knit', 'Fine Double Collar Tipping', 'Comfort Athletic Cut'],
    stock: 18
  },
  {
    id: 'po3',
    name: 'Wear & Gear Textured Knit Polo - Olive',
    price: 1050,
    description: 'Stunning textured olive green knit polo shirt with stylish matching dark-tone closure buttons and smart ribbed cuff trim details.',
    category: 'polo-shirt',
    images: [
      imageOliveTexturedPolo,
      imageWhiteContrastPolo,
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Premium Cotton Giza blend', 'Unique Olive Texture Way', 'Sleek Black Buttons detail'],
    stock: 22
  },
  {
    id: 'po4',
    name: 'Wear & Gear Luxury Classic Polo - Burgundy',
    price: 1100,
    description: 'Luxurious burgundy maroon fitted polo shirt accented by subtle deep charcoal collar details and pure Egyptian combed-cotton weave.',
    category: 'polo-shirt',
    images: [
      imageBurgundyLuxuryPolo,
      imageOliveTexturedPolo,
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['100% Egyptian Combed Weave', 'Accent Deep Charcoal Borders', 'Fitted Casual Premium drape'],
    stock: 30
  },
  {
    id: 'sw1',
    name: 'Wear & Gear Heritage Sweatshirt - Navy Blue',
    price: 1150,
    description: 'Our premium heritage active crewneck sweatshirt, custom-built with rich loopback fleece for cold-weather comfort and designed with high durability seams for ultimate longevity.',
    category: 'sweatshirt',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-a197596effbc?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Premium Heavy Cotton Fleece', 'Double-Needle Ribbed Trim', 'Rich Royal Navy Shade'],
    stock: 30
  },
  {
    id: 'sw2',
    name: 'Wear & Gear Minimalist Streetwear Crew - Navy',
    price: 1250,
    description: 'Modern relaxed oversized fit with clean dropped shoulders, styled in deeply pigmented navy blue knit for an effortless contemporary everyday vibe.',
    category: 'sweatshirt',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Breathable Core Loopback', 'Contemporary Dropped Shoulders', 'Super-Soft Minimalist Silhouette'],
    stock: 15
  },
  {
    id: 'h1',
    name: 'Wear & Gear Premium Cozy Hoodie - White',
    price: 1850,
    discountBadge: 'Cozy Winter',
    description: 'Our luxurious premium white pullover fleece hoodie, meticulously tailored with thick loopback warmth, clean white drawstrings, and an extremely cozy modern drape as requested.',
    category: 'hoodie',
    images: [
      imageWhiteHoodieModel,
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-a197596effbc?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['100% Cotton Fleece Lined', 'Comfort Drawstrings Detail', 'Premium Standard Drop Shoulder'],
    stock: 14
  },
  {
    id: 'h2',
    name: 'Wear & Gear "Another Dimension" Hoodie',
    price: 1850,
    originalPrice: 2200,
    discountBadge: 'Street Style',
    description: 'A premium, warm heavy-fleece custom-tailored pullover hoodie designed in a gorgeous organic olive-green tone, featuring a clean "ANOTHER DIMENSION" typography printed across the front chest.',
    category: 'hoodie',
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509948943863-af2ef4d56b5a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-a197596effbc?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Organic Olive Green Weave', 'ANOTHER DIMENSION Print Detail', 'Cozy Warm Heavy Fleece Lining'],
    stock: 10
  },
  {
    id: 'hs1',
    name: 'Wear & Gear Premium Vertical Striped - Teal Green',
    price: 1450,
    originalPrice: 1650,
    discountBadge: 'PREMIUM',
    description: 'A stunning premium vertical-striped casual short-sleeve button-down shirt styled in an exquisite teal-green shade. Tailored to perfection with fine vertical white pinstripes for a sophisticated summer aesthetic.',
    category: 'half-shirt',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Premium Cotton-Linen Blend', 'Teal Green & White Pinstripes', 'Relaxed Breathable Fit'],
    stock: 14
  },
  {
    id: 'hs2',
    name: 'Wear & Gear Classic Resort Stripe - Ocean Blue',
    price: 1350,
    discountBadge: 'HOT',
    description: 'Stay breezy with this classic resort-style vertical stripe half-shirt in refreshing ocean blue. Crafted with lightweight breathable cotton weave for maximum all-day comfort.',
    category: 'half-shirt',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      imageLightGreySummerShirt
    ],
    features: ['Lightweight Comfort Weave', 'Classic Casual Spread Collar', 'Elegant Chest Pocket Accent'],
    stock: 18
  },
  {
    id: 'hs3',
    name: 'Wear & Gear Luxury Pinstripe - Terracotta',
    price: 1550,
    originalPrice: 1750,
    discountBadge: 'TRENDING',
    description: 'Exquisitely textured casual half-shirt featuring luxury vertical pinstripes in warm terracotta peach. Perfect for sophisticated casual dress-up occasions.',
    category: 'half-shirt',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c05518e99309?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Mercerized Cotton Blend', 'Sophisticated Clean Pinstripes', 'Premium Matching Closures'],
    stock: 12
  },
  {
    id: 'hs4',
    name: 'Wear & Gear Minimalist Casual - Silver Grey',
    price: 1250,
    discountBadge: 'SUMMER COOL',
    description: 'The ultimate super-soft casual half-shirt crafted with premium structured cotton fabric in a cool, calming silver grey shade, guaranteeing a stylish modern drape.',
    category: 'half-shirt',
    images: [
      imageLightGreySummerShirt,
      'https://images.unsplash.com/photo-1598033129183-c4fa50c7bb6c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Ultra-Soft Brushed Finish', 'Calming Silver Grey Tone', 'Reinforced Durable Hems'],
    stock: 20
  },
  {
    id: 'po5',
    name: 'Wear & Gear Performance Tech Polo',
    price: 1450,
    description: 'Engineered for the active lifestyle, this premium forest-green designer polo features fine white polo tipping details and pristine quick-dry texture.',
    category: 'polo-shirt',
    images: [
      imageForestGreenPolo,
      imageWhiteContrastPolo,
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Active Quick Dry Technology', 'White Collar Tipping', 'Premium Comfortable Stretch'],
    stock: 12
  },
  {
    id: 'h3',
    name: 'Wear & Gear Minimalist Streetwear Hoodie - Chestnut Brown',
    price: 1950,
    originalPrice: 2400,
    discountBadge: 'Essential',
    description: 'Our popular minimalist street-style drawstring pullover hoodie crafted from heavyweight ultra-soft premium cotton fleece in a beautiful, warm, trendy chestnut brown shade.',
    category: 'hoodie',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509948943863-af2ef4d56b5a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Trendy Warm Chestnut Tone', 'Premium Metal Tip Aglets', 'Boxy Streetwear Drop Shoulder Silhouette'],
    stock: 8
  },
  {
    id: 't5',
    name: 'Wear & Gear Active Jogger - Olive Green',
    price: 1550,
    originalPrice: 1750,
    discountBadge: 'SALE',
    description: 'Premium forest olive-green slim-fit active jogger trouser featuring a cozy elastic drawstring, side zip pockets, and high-performance breathable construction.',
    category: 'trouser',
    images: [
      imageOliveGreenJogger,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Breathable Active Knit', 'Elastic Drawstring Waist', 'Secure Side Zip Pockets'],
    stock: 14
  },
  {
    id: 'p5',
    name: 'Wear & Gear Teal Chevron Panjabi',
    price: 2450,
    originalPrice: 2855,
    discountBadge: 'Premium',
    description: 'An elegant steel-blue (dark teal) designer Panjabi with a fine zigzag chevron self-texture and beautiful dark green and gold embroidered detailing on the mandarin collar.',
    category: 'panjabi',
    images: [
      imageTealChevronPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Zigzag Chevron Texture', 'Premium Cotton-Silk Blend', 'Bespoke Fit'],
    stock: 5
  },
  {
    id: 'p6',
    name: 'Wear & Gear Festive Checked Panjabi - Purple',
    price: 1550,
    description: 'A premium designer purple and grey checked/plaid pattern cotton Panjabi featuring a neat mandarin collar. Tailored to perfection for daily comfort and festive events.',
    category: 'panjabi',
    images: [
      imagePurpleCheckedPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['100% Breathable Cotton', 'Checked/Plaid Texture', 'Classic Fitting'],
    stock: 12
  },
  {
    id: 'p7',
    name: 'Wear & Gear Geometric Tile Printed Panjabi - Grey',
    price: 1680,
    description: 'A high-end, premium grey designer Panjabi featuring a delicate, elegant repeating geometric floral tile print with dynamic collar embroidery.',
    category: 'panjabi',
    images: [
      imageGreyPatternedSwimPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Delicate Floral Print', 'Embroidered Collar & Placket', 'Modern Fit'],
    stock: 10
  },
  {
    id: 'p8',
    name: 'Wear & Gear Charcoal Striped Panjabi',
    price: 1850,
    discountBadge: 'Trending',
    description: 'An elegant charcoal black and dark brown subtly pinstriped designer Panjabi featuring ultra-refined geometric embroidered borders along the mandarin collar and cuffs.',
    category: 'panjabi',
    images: [
      imageCharcoalStripedPanjabi,
      imageGreyPanjabi,
      imagePanjabi,
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Charcoal Pinstripes', 'Refined Geometric Borders', 'Signature Luxury Finish'],
    stock: 8
  },
  {
    id: 't6',
    name: 'Wear & Gear Commando Cargo - Cream',
    price: 1150,
    description: 'Premium cream sand-beige cargo active trousers with custom zipper pulls, utilitarian military pocket detailing, and adjustable waist drawstring cords.',
    category: 'trouser',
    images: [
      imageCreamCargoYellowBg,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Cream Sand Cotton', 'Utilitarian Cargo Zips', 'COMMANDO detailing'],
    stock: 20
  },
  {
    id: 't7',
    name: 'Wear & Gear Commando Jogger - Black',
    price: 1850,
    description: "Sleek coal black active sports cuffed jogger featuring a bold vertical 'COMMANDO' letter printed along the legs, built with stretch nylon fiber for maximum mobility.",
    category: 'trouser',
    images: [
      imageBlackCommandoJogger,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Athletic Slim Fit', 'COMMANDO printed motif', 'Moisture Wicking Structure'],
    stock: 15
  },
  {
    id: 't8',
    name: 'Wear & Gear Commando Cargo - Blue',
    price: 1950,
    description: 'Urban streetwear active trousers in dusty royal-blue, with military-grade flap pockets, cargo webbing, and custom drawstring waistband.',
    category: 'trouser',
    images: [
      imageBlueCommandoCargo,
      imageSandActiveJogger,
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Dusty Active Blue Blend', 'Commando Side Utility Pockets', 'Adjustable Cuffed Cords'],
    stock: 12
  },
  {
    id: 'po6',
    name: 'Wear & Gear Summer Breeze Shirt - Light Grey',
    price: 950,
    description: 'Super lightweight, breathable short-sleeve button-down casual shirt in high-quality silver grey, designed specifically for comfort during the humid summer months.',
    category: 'polo-shirt',
    images: [
      imageLightGreySummerShirt,
      imageWhiteContrastPolo,
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Ultra-Light Silver Cotton', 'Breathable Material', 'Stylishly Unbuttoned Collar'],
    stock: 25
  },
  {
    id: 'po7',
    name: 'Wear & Gear Classic Polo - Pastel Lavender',
    price: 1250,
    description: 'Delicately tailored in a stunning summer-friendly pastel lavender-purple shade, this premium combed-cotton polo represents comfort and understated luxury.',
    category: 'polo-shirt',
    images: [
      imageLavenderPolo,
      imageWhiteContrastPolo,
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Pastel Lavender Shade', 'Fitted Contemporary Silhouette', 'Soft Micro-Knit Weave'],
    stock: 14
  },
  {
    id: 'po8',
    name: 'Wear & Gear Luxury Pique Polo - Charcoal Grey',
    price: 1550,
    description: 'The ultimate formal charcoal grey polo crafted with rich combed pique weave and matching button closure, easily transitioning from boardroom meetings to elegant dinners.',
    category: 'polo-shirt',
    images: [
      imageCharcoalGreyPolo,
      imageWhiteContrastPolo,
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Solid Charcoal Grey Hue', 'Premium Pique Structured Collar', 'Breathable Smart Active Frame'],
    stock: 10
  }
];
