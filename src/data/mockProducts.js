import { resolveProductImage } from './localAssets';

const productSeed = [
  {
    id: 1,
    name: 'Wilderness Salmon Blend',
    description: 'Curated organic salmon kibble with garden botanicals for everyday vitality.',
    price: 32,
    imageUrl: 'WildernessSalmonBlend.png',
    rating: 4.9,
    reviewCount: 128,
    stock: 24,
    categoryId: 1,
    badge: 'ORGANIC',
    size: 'Organic, 2kg Bag'
  },
  {
    id: 2,
    name: 'Grain-Free Puppy Feast',
    description: 'A gentle puppy recipe with clean protein, sweet potato, and glossy-coat nutrients.',
    price: 28.5,
    imageUrl: 'Grain-FreePuppyFreast.png',
    rating: 4.8,
    reviewCount: 95,
    stock: 18,
    categoryId: 1,
    size: 'Puppy blend, 1.8kg Bag'
  },
  {
    id: 3,
    name: 'Harvest Venison & Sweet Potato',
    description: 'Sustainable source, high-protein formula.',
    price: 45,
    imageUrl: 'HarvestVenison&SweetPotato.png',
    rating: 5,
    reviewCount: 210,
    stock: 12,
    categoryId: 1,
    size: 'Chef plate, 12 portions'
  },
  {
    id: 4,
    name: 'Senior Care Vitality Mix',
    description: 'Balanced nutrition for senior companions with joint-supporting minerals.',
    price: 36,
    imageUrl: 'SeniorCareVitalityMix.png',
    rating: 4.7,
    reviewCount: 52,
    stock: 4,
    categoryId: 1,
    badge: 'LOW STOCK',
    size: 'Senior blend, 60 capsules'
  },
  {
    id: 5,
    name: 'Raw Freeze-Dried Beef',
    description: 'Premium raw beef recipe prepared for rich flavor and nutrient density.',
    price: 42,
    imageUrl: 'RawFreeze-DriedBeef.png',
    rating: 4.9,
    reviewCount: 314,
    stock: 9,
    categoryId: 1,
    size: 'Freeze-dried, 750g'
  },
  {
    id: 6,
    name: 'Wild Atlantic Salmon Kibble',
    description: 'Grain-free salmon and sweet potato kibble for sensitive digestion.',
    price: 74.99,
    imageUrl: 'WildAtlanticSalmonKibble.png',
    rating: 4.9,
    reviewCount: 142,
    stock: 15,
    categoryId: 1,
    size: 'Grain-free, 12kg Bag'
  },
  {
    id: 7,
    name: 'Cloud-Touch Orthopedic Nest',
    description:
      "Designed for the discerning pet who demands both style and substance. Our Cloud-Touch Nest features multi-layered Italian memory foam encased in a breathable, ultra-soft woven texture that mimics the comfort of a mother's embrace.",
    price: 189,
    imageUrl: 'Cloud-TouchOrthopedicNest.png',
    rating: 4.9,
    reviewCount: 124,
    stock: 8,
    categoryId: 2,
    badge: 'Artisan Crafted',
    size: 'Medium / Oatmeal Linen'
  },
  {
    id: 8,
    name: 'Cloud-Soothe Orthopedic Bed',
    description: 'A deep orthopedic lounge bed with cloud-soft bolsters and a calm teal sanctuary profile.',
    price: 125,
    imageUrl: 'Cloud-SootheOrthopedicBed.png',
    rating: 4.8,
    reviewCount: 156,
    stock: 10,
    categoryId: 2,
    badge: 'BEST REST',
    size: 'Medium / Teal Linen'
  },
  {
    id: 9,
    name: 'Cashmere Blend Throw',
    description: 'A richly woven throw that adds warmth to any sanctuary corner.',
    price: 55,
    imageUrl: 'CashmereBlendThrow.png',
    rating: 4.7,
    reviewCount: 67,
    stock: 20,
    categoryId: 2,
    size: 'Woven cashmere blend'
  },
  {
    id: 10,
    name: 'Sculpted Ceramic Duo',
    description: 'Weighted ceramic bowls with an easy-clean gloss finish.',
    price: 72,
    imageUrl: 'SculptedCeramicDuo.png',
    rating: 4.8,
    reviewCount: 88,
    stock: 13,
    categoryId: 3,
    size: 'Raised ceramic bowl set'
  },
  {
    id: 11,
    name: 'Organic Cotton Rope Set',
    description: 'Soft organic rope toys crafted for gentle enrichment.',
    price: 29,
    imageUrl: 'OrganicCottonRopeSet.png',
    rating: 4.6,
    reviewCount: 41,
    stock: 30,
    categoryId: 4,
    size: 'Three-piece play set'
  },
  {
    id: 12,
    name: 'Botanical Bath Ritual',
    description: 'A calming botanical grooming kit for clean coats and quiet evenings.',
    price: 38,
    imageUrl: 'BotanicalBathRitual.png',
    rating: 4.8,
    reviewCount: 76,
    stock: 16,
    categoryId: 5,
    size: 'Calming coat ritual'
  }
];

export const products = productSeed.map((product) => ({
  ...product,
  image: resolveProductImage(product.imageUrl)
}));
