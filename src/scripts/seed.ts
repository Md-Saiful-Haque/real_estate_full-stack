/**
 * Run: npx tsx src/scripts/seed.ts
 * Requires MONGODB_URI (and optional MONGODB_DB_NAME) in .env.local
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "path";
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import type { PropertyDoc, UserDoc, UserRole } from "../types/index";

const dbName = process.env.MONGODB_DB_NAME ?? "real_estate";

const USERS: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}[] = [
  {
    email: "user@nestfinder.demo",
    name: "Jordan Ellis",
    password: "DemoUser123!",
    role: "user",
  },
  {
    email: "admin@nestfinder.demo",
    name: "Riley Chen",
    password: "AdminDemo123!",
    role: "admin",
  },
  {
    email: "manager@nestfinder.demo",
    name: "Sam Rivera",
    password: "ManagerDemo123!",
    role: "manager",
  },
];

const PROPERTIES: Omit<PropertyDoc, "_id">[] = [
  {
    slug: "riverside-craftsman-portland",
    title: "Riverside Craftsman with Studio",
    shortDescription:
      "Four-bedroom home near the Willamette with a detached studio and updated kitchen.",
    description:
      "Set along a quiet tree-lined street, this craftsman retains original millwork and built-ins while offering an open kitchen with quartz counters, a Wolf range, and a walk-in pantry. The main level includes a formal dining room and a main suite with a tiled steam shower. The lower level walks out to a bluestone patio overlooking the river. The detached studio works well as an office or guest space. Recent upgrades include a new roof (2024), tankless water heater, and EV-ready garage wiring.",
    price: 875000,
    category: "house",
    city: "Portland",
    state: "OR",
    zip: "97202",
    beds: 4,
    baths: 3,
    sqft: 2840,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ],
    ratingAvg: 4.8,
    reviewCount: 12,
    listedAt: new Date("2026-02-10"),
    featured: true,
  },
  {
    slug: "skyline-condo-seattle",
    title: "Skyline Corner Condo",
    shortDescription:
      "Two-bedroom corner unit with floor-to-ceiling glass and smart climate control.",
    description:
      "Wake up to Elliott Bay views from this northwest-facing corner on the thirty-fourth floor. The layout separates bedrooms from living space for quiet work-from-home days. Kitchen features paneled appliances, a wine column, and stone waterfall island. Building amenities include a rooftop lounge, fitness studio, and 24-hour concierge. Two deeded parking spaces and a storage cage transfer with the sale.",
    price: 1125000,
    category: "condo",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    beds: 2,
    baths: 2,
    sqft: 1420,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    ],
    ratingAvg: 4.6,
    reviewCount: 9,
    listedAt: new Date("2026-02-18"),
    featured: true,
  },
  {
    slug: "oak-townhome-austin",
    title: "Oak Hill Townhome with Rooftop Deck",
    shortDescription:
      "End unit with three levels, private elevator option, and downtown skyline views.",
    description:
      "This end-unit townhome captures cross breezes through oversized windows and sliding glass that opens to a private yard. The rooftop deck is plumbed for an outdoor kitchen. Interior finishes include wide-plank oak floors, designer lighting, and a third-floor loft ideal for media or guests. The community includes a dog park and guest suites for visitors.",
    price: 689000,
    category: "townhome",
    city: "Austin",
    state: "TX",
    zip: "78704",
    beds: 3,
    baths: 3,
    sqft: 2100,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    ratingAvg: 4.7,
    reviewCount: 7,
    listedAt: new Date("2026-02-22"),
    featured: true,
  },
  {
    slug: "meadow-lot-boulder",
    title: "Meadow Building Site with Utilities",
    shortDescription:
      "Two-acre parcel with water tap paid and mountain views toward the Flatirons.",
    description:
      "Survey and soils report are available. The lot sits at the end of a cul-de-sac with approved driveway easement. HOA allows architect-designed homes with minimum 2,800 square feet of living space. Wildlife corridor setbacks are already reflected in the buildable envelope map. Seller will consider short-term seller financing for qualified builders.",
    price: 425000,
    category: "land",
    city: "Boulder",
    state: "CO",
    zip: "80302",
    beds: 0,
    baths: 0,
    sqft: 0,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=1200&q=80",
    ],
    ratingAvg: 4.2,
    reviewCount: 4,
    listedAt: new Date("2026-01-30"),
    featured: false,
  },
  {
    slug: "warehouse-loft-denver",
    title: "Warehouse District Creative Loft",
    shortDescription:
      "Mixed-use zoned studio with fourteen-foot ceilings and freight elevator access.",
    description:
      "Ideal for creative production or a live-work setup where permitted. Polished concrete floors, heavy power, and reinforced mezzanine storage. Walking distance to commuter rail and the stadium district. CAM charges include security patrol and snow removal. Seller completed asbestos abatement in 2025 with full documentation.",
    price: 950000,
    category: "commercial",
    city: "Denver",
    state: "CO",
    zip: "80205",
    beds: 1,
    baths: 2,
    sqft: 3200,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad4ab?w=1200&q=80",
    ],
    ratingAvg: 4.4,
    reviewCount: 6,
    listedAt: new Date("2026-02-05"),
    featured: false,
  },
  {
    slug: "victorian-sf-noe",
    title: "Restored Victorian in Noe Valley",
    shortDescription:
      "Classic facade with modern systems, two-car garage, and south-facing garden.",
    description:
      "Period details include stained glass, pocket doors, and ceiling medallions. Behind the walls you will find updated electrical, seismic bolting, and dual-zone HVAC. The garden level offers a legal one-bedroom unit with separate entrance—ideal for rental income or extended family. Open houses scheduled Saturday and Sunday afternoons.",
    price: 2650000,
    category: "house",
    city: "San Francisco",
    state: "CA",
    zip: "94114",
    beds: 5,
    baths: 4,
    sqft: 3520,
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    ratingAvg: 4.9,
    reviewCount: 15,
    listedAt: new Date("2026-02-12"),
    featured: true,
  },
  {
    slug: "lakeside-retreat-minneapolis",
    title: "Lakeside Retreat with Dock Rights",
    shortDescription:
      "Three-bedroom rambler with screened porch and shared dock on Cedar Lake.",
    description:
      "Enjoy morning coffee on the screened porch before walking down to the community dock for kayaking. Interior spaces were opened to create a connected kitchen and family room with a gas fireplace. Mechanicals replaced in 2023 including furnace, AC, and sewer line to street. Association handles shoreline restoration and pier maintenance.",
    price: 615000,
    category: "house",
    city: "Minneapolis",
    state: "MN",
    zip: "55416",
    beds: 3,
    baths: 2,
    sqft: 1980,
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3b36?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    ],
    ratingAvg: 4.5,
    reviewCount: 8,
    listedAt: new Date("2026-02-20"),
    featured: false,
  },
  {
    slug: "brick-condo-chicago",
    title: "Printer's Row Brick Condo",
    shortDescription:
      "One-bedroom loft with exposed brick, in-unit laundry, and transit at the door.",
    description:
      "Located in the historic South Loop, this home offers true loft volume with organized storage and a defined office nook. Assessments cover heat, high-speed internet in common areas, and a shared roof deck with grills. Rental cap not yet met—verify with association for investor use.",
    price: 349000,
    category: "condo",
    city: "Chicago",
    state: "IL",
    zip: "60605",
    beds: 1,
    baths: 1,
    sqft: 980,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
    ratingAvg: 4.3,
    reviewCount: 11,
    listedAt: new Date("2026-02-01"),
    featured: false,
  },
  {
    slug: "suburban-colonial-boston",
    title: "Suburban Colonial Near Commuter Rail",
    shortDescription:
      "Center-hall colonial with finished basement and mudroom built for New England seasons.",
    description:
      "The main level centers on a kitchen that opens to a sun-filled breakfast area. Upstairs, four bedrooms include a primary suite with walk-in closet. The basement adds a gym, full bath, and media room. Walk to the commuter rail, town center shops, and highly rated schools. Fresh paint and refinished floors throughout.",
    price: 925000,
    category: "house",
    city: "Newton",
    state: "MA",
    zip: "02458",
    beds: 4,
    baths: 3,
    sqft: 2680,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80",
    ],
    ratingAvg: 4.7,
    reviewCount: 10,
    listedAt: new Date("2026-02-14"),
    featured: false,
  },
  {
    slug: "desert-modern-scottsdale",
    title: "Desert Modern with Negative-Edge Pool",
    shortDescription:
      "Single-level estate with automated shades, outdoor kitchen, and mountain panoramas.",
    description:
      "Designed for indoor-outdoor living, this home wraps around a heated pool and spa with unobstructed Camelback views. Interior palette pairs warm oak cabinetry with limestone floors. Smart lighting, irrigation, and security are controlled from phone or wall tablets. Furniture available by separate bill of sale.",
    price: 2150000,
    category: "house",
    city: "Scottsdale",
    state: "AZ",
    zip: "85255",
    beds: 4,
    baths: 4,
    sqft: 4100,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1602343164077-053fe966d2e6?w=1200&q=80",
    ],
    ratingAvg: 4.9,
    reviewCount: 14,
    listedAt: new Date("2026-02-25"),
    featured: true,
  },
  {
    slug: "urban-townhome-nashville",
    title: "Urban Townhome Steps from Music Row",
    shortDescription:
      "Three-story townhome with balcony, two-car tandem garage, and sound-insulated walls.",
    description:
      "Built for musicians and remote workers, this unit adds extra insulation between floors and a pre-wired studio nook. Rooftop balcony fits a compact seating group with skyline views. HOA maintains exterior paint cycle and private alley lighting.",
    price: 579000,
    category: "townhome",
    city: "Nashville",
    state: "TN",
    zip: "37203",
    beds: 3,
    baths: 3,
    sqft: 1890,
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80",
    ],
    ratingAvg: 4.4,
    reviewCount: 5,
    listedAt: new Date("2026-02-08"),
    featured: false,
  },
  {
    slug: "coastal-commercial-miami",
    title: "Coastal Retail Bayfront Suite",
    shortDescription:
      "End-cap retail suite with dock loading, grease trap stub, and visible signage rights.",
    description:
      "Suited for restaurant or fitness concepts with high ceilings and roll-up door option at rear. Zoning allows outdoor seating with approved plan. CAM includes parking validation system and trash compactor. Seller may contribute to tenant improvement allowance at agreed rent.",
    price: 1780000,
    category: "commercial",
    city: "Miami",
    state: "FL",
    zip: "33131",
    beds: 0,
    baths: 2,
    sqft: 2800,
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
    ],
    ratingAvg: 4.1,
    reviewCount: 3,
    listedAt: new Date("2026-01-20"),
    featured: false,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in .env.local");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const userCol = db.collection<UserDoc>("users");
  const propCol = db.collection<PropertyDoc>("properties");
  const revCol = db.collection("reviews");

  await userCol.deleteMany({
    email: { $in: USERS.map((u) => u.email) },
  });
  for (const u of USERS) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await userCol.insertOne({
      _id: new ObjectId(),
      email: u.email,
      name: u.name,
      passwordHash,
      role: u.role,
      createdAt: new Date(),
    });
  }

  await propCol.deleteMany({});
  for (const p of PROPERTIES) {
    await propCol.insertOne({ ...p, _id: new ObjectId() });
  }

  await revCol.deleteMany({});

  console.log("Seed complete: users and properties.");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
