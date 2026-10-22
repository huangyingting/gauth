import worldMapPoisJson from "./world-map-pois.json";

export interface AtlasChapterCard {
  id: string;
  title: string;
  body: string;
  era: string;
  location: string;
  sourceLabel: string;
  accentColor: string;
}

export interface AtlasSessionItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Video" | "Interactive Story";
  duration?: string;
  thumbnailLabel: string;
  accentGradient: string;
  href: string;
  chapters: AtlasChapterCard[];
}

export interface WorldMapPoiItem {
  id: string;
  title: string;
  summary: string;
  region: string;
  category: "Person" | "Politics" | "Economy" | "Other";
  startYear: number;
  endYear: number;
  lat: number;
  lng: number;
  source?: "Featured" | "Mine";
}

export const ATLAS_VOICEOVER_LANGUAGES = [
  "Arabic",
  "Chinese",
  "English (India)",
  "English (United Kingdom)",
  "English (United States)",
  "French",
  "German",
  "Hindi",
  "Indonesian",
  "Italian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Spanish",
  "Turkish",
  "Vietnamese",
] as const;

export const ATLAS_VIDEO_STORIES: AtlasSessionItem[] = [
  {
    id: "video-apollo-11",
    title: "Apollo 11 Moon Mission Journey",
    subtitle: "From Kennedy Space Center Launch Complex 39A to Tranquility Base and safe splashdown.",
    category: "Video",
    duration: "01:49",
    thumbnailLabel: "1969 Lunar Landing",
    accentGradient: "from-slate-900 via-blue-950 to-indigo-900",
    href: "/atlas/session/video-apollo-11",
    chapters: [
      {
        id: "apollo-c1",
        title: "Saturn V Ignition at Pad 39A",
        body: "On July 16, 1969, five F-1 engines generated 7.5 million pounds of thrust, lifting Neil Armstrong, Buzz Aldrin, and Michael Collins toward translunar injection.",
        era: "July 16, 1969",
        location: "Cape Canaveral, Florida",
        sourceLabel: "NASA Apollo 11 Flight Journal",
        accentColor: "#3B82F6",
      },
      {
        id: "apollo-c2",
        title: "Eagle Powered Descent & 1202 Alarm",
        body: "As Lunar Module Eagle descended toward the Sea of Tranquility, the Apollo Guidance Computer prioritized landing radar tasks while Armstrong piloted past a boulder-strewn crater with 25 seconds of fuel remaining.",
        era: "July 20, 1969",
        location: "Mare Tranquillitatis, Moon",
        sourceLabel: "MIT Instrumentation Lab Telemetry",
        accentColor: "#6366F1",
      },
    ],
  },
  {
    id: "video-zhuge-liang",
    title: "Zhuge Liang: Chancellor of Shu Han",
    subtitle: "The Longzhong Plan, Battle of Red Cliffs alliance, and Northern Expeditions.",
    category: "Video",
    duration: "01:49",
    thumbnailLabel: "Three Kingdoms Strategy",
    accentGradient: "from-amber-950 via-stone-900 to-emerald-950",
    href: "/atlas/session/video-zhuge-liang",
    chapters: [
      {
        id: "zhuge-c1",
        title: "The Longzhong Three-Part Strategy",
        body: "Visited three times by Liu Bei in his thatched cottage, Zhuge Liang outlined a grand geopolitical blueprint: secure Jing and Yi provinces, ally with Eastern Wu, and restore the Han dynasty.",
        era: "207 CE",
        location: "Longzhong, Hubei",
        sourceLabel: "Records of the Three Kingdoms (Sanguozhi)",
        accentColor: "#10B981",
      },
    ],
  },
  {
    id: "video-manila-galleon",
    title: "The Manila Galleon Trade Route",
    subtitle: "250 years of trans-Pacific navigation linking Acapulco silver with Asian silk and porcelain.",
    category: "Video",
    duration: "01:55",
    thumbnailLabel: "Pacific Silver & Silk",
    accentGradient: "from-cyan-950 via-teal-900 to-slate-900",
    href: "/atlas/session/video-manila-galleon",
    chapters: [
      {
        id: "galleon-c1",
        title: "Urdaneta's Kuroshio Return Route",
        body: "In 1565, Andrés de Urdaneta discovered the northern Pacific westerlies near 40°N latitude, making round-trip voyages between Manila and Acapulco possible for two and a half centuries.",
        era: "1565–1815",
        location: "Manila — Acapulco",
        sourceLabel: "Archivo General de Indias",
        accentColor: "#06B6D4",
      },
    ],
  },
  {
    id: "video-normandy-dday",
    title: "The Normandy Landings of D-Day",
    subtitle: "Operation Overlord across Utah, Omaha, Gold, Juno, and Sword beaches on June 6, 1944.",
    category: "Video",
    duration: "02:32",
    thumbnailLabel: "Operation Overlord",
    accentGradient: "from-zinc-900 via-slate-800 to-blue-950",
    href: "/atlas/session/video-normandy-dday",
    chapters: [
      {
        id: "dday-c1",
        title: "Airborne Drop & Amphibious Dawn",
        body: "Over 156,000 Allied troops crossed the English Channel supported by 6,939 vessels and 11,590 aircraft to breach the Atlantic Wall and liberate Western Europe.",
        era: "June 6, 1944",
        location: "Normandy Coast, France",
        sourceLabel: "SHAEF Operational Dispatches",
        accentColor: "#2563EB",
      },
    ],
  },
  {
    id: "video-industrial-revolution",
    title: "The First Industrial Revolution",
    subtitle: "How mechanized spinning, Watt steam engines, and iron railways reshaped human civilization.",
    category: "Video",
    duration: "01:55",
    thumbnailLabel: "Steam & Mechanization",
    accentGradient: "from-orange-950 via-amber-900 to-stone-900",
    href: "/atlas/session/video-industrial-revolution",
    chapters: [
      {
        id: "indrev-c1",
        title: "From Cottage Looms to Steam Mills",
        body: "Arkwright's water frame and Watt's rotary steam engine multiplied cotton textile output by orders of magnitude, concentrating labor in industrial cities.",
        era: "1760–1840",
        location: "Lancashire & Midlands, Britain",
        sourceLabel: "British Parliamentary Factory Inquiries",
        accentColor: "#F59E0B",
      },
    ],
  },
  {
    id: "video-age-of-discovery",
    title: "Age of Discovery and Maritime Exploration",
    subtitle: "Oceanic cartography from Cape Bojador to the Strait of Magellan.",
    category: "Video",
    duration: "02:02",
    thumbnailLabel: "Global Maritime Routes",
    accentGradient: "from-indigo-950 via-sky-900 to-emerald-950",
    href: "/atlas/session/video-age-of-discovery",
    chapters: [
      {
        id: "disc-c1",
        title: "Rounding the Cape of Good Hope",
        body: "Bartolomeu Dias and Vasco da Gama connected Lisbon directly to the Indian Ocean spice trade, shifting European economic gravity from the Mediterranean to the Atlantic.",
        era: "1488–1498",
        location: "Lisbon — Calicut",
        sourceLabel: "Torre do Tombo Royal Archives",
        accentColor: "#0EA5E9",
      },
    ],
  },
];

export const ATLAS_INTERACTIVE_SESSIONS: AtlasSessionItem[] = [
  {
    id: "2008824210280452",
    title: "Empires of the Silk Roads",
    subtitle: "The Kiln Transformation, Persian Cobalt, and Eurasian Caravan Networks",
    category: "Interactive Story",
    thumbnailLabel: "The Kiln Transformation",
    accentGradient: "from-blue-950 via-indigo-900 to-amber-900",
    href: "/atlas/session/2008824210280452",
    chapters: [
      {
        id: "silk-1",
        title: "The Crucible's Breath",
        body: "Inside the vaulted brick chamber of a Jingdezhen dragon kiln, the atmosphere thickens with the roar of burning pine. Potters monitor the inferno through small apertures, gauging the temperature by the color of the flames—a blinding white-hot glow signaling the moment of chemical metamorphosis.",
        era: "13th–15th Century",
        location: "Jingdezhen, Jiangxi",
        sourceLabel: "Imperial Kiln Archaeological Corpus",
        accentColor: "#2563EB",
      },
      {
        id: "silk-2",
        title: "Alchemy of Cobalt",
        body: 'Before the firing, the cobalt pigment appears as a dull, muddy grey, often imported from the Persian plateau as "Mohammedan blue." Under the intense pressure of 1,200°C, the cobalt oxide undergoes a structural shift, shedding impurities to emerge as a vibrant, saturated pigment suspended within the molten silica.',
        era: "Yuan & Ming Dynasties",
        location: "Kashan (Persia) — Jingdezhen",
        sourceLabel: "Freer Gallery Ceramic Spectroscopy",
        accentColor: "#1D4ED8",
      },
      {
        id: "silk-3",
        title: "The Vitrification Shield",
        body: "As the kiln cools, the liquid glaze hardens into a seamless layer of vitrified glass that seals the cobalt beneath its surface. This protective barrier renders the intricate floral motifs impervious to the elements, ensuring the pigment remains as sharp and brilliant as the day the brush first touched the clay.",
        era: "1350–1450 CE",
        location: "Eurasian Overland & Maritime Silk Roads",
        sourceLabel: "Topkapi Palace & Ardabil Shrine Collections",
        accentColor: "#0284C7",
      },
      {
        id: "silk-4",
        title: "A Legacy of Permanence",
        body: "This high-fire resilience allowed porcelain to survive centuries of maritime transit, emerging from shipwrecks with its luster entirely intact. The enduring clarity of the blue-and-white aesthetic remains a testament to the precise synchronization of mineral chemistry and pyrotechnic control mastered by Yuan and Ming dynasty artisans.",
        era: "1400–1700 CE",
        location: "Indian Ocean & South China Sea",
        sourceLabel: "Belitung & Nan'ao Shipwreck Excavations",
        accentColor: "#4F46E5",
      },
    ],
  },
  {
    id: "2008824210285316",
    title: "Mongol Expansion and Eurasian Connection",
    subtitle: "How the Yam postal relay and Pax Mongolica integrated continents from Karakorum to Tabriz.",
    category: "Interactive Story",
    thumbnailLabel: "Pax Mongolica",
    accentGradient: "from-amber-900 via-red-950 to-stone-900",
    href: "/atlas/session/2008824210285316",
    chapters: [
      {
        id: "mongol-1",
        title: "The Yam Relay Network",
        body: "Stretched every 25 to 30 miles across the steppe, Yam relay stations stocked fresh horses and rations, enabling imperial couriers holding a silver paiza tablet to cover 200 miles a day.",
        era: "1206–1368 CE",
        location: "Karakorum — Khanbaliq — Sarai",
        sourceLabel: "The Secret History of the Mongols",
        accentColor: "#D97706",
      },
      {
        id: "mongol-2",
        title: "Cosmopolitan Trade under the Paiza",
        body: "By unifying customs laws and protecting merchant ortoq partnerships, the Mongol Empire connected Venetian travelers, Persian astronomers, and Chinese engineers across a single transcontinental sphere.",
        era: "13th Century",
        location: "Samarkand & Tabriz",
        sourceLabel: "Jami' al-Tawarikh (Rashid al-Din)",
        accentColor: "#DC2626",
      },
    ],
  },
  {
    id: "2008824210315780",
    title: "Artemis II Mission Overview",
    subtitle: "Humanity's crewed return to lunar vicinity aboard the Orion spacecraft and SLS rocket.",
    category: "Interactive Story",
    thumbnailLabel: "Crewed Lunar Flyby",
    accentGradient: "from-indigo-950 via-slate-900 to-blue-900",
    href: "/atlas/session/2008824210315780",
    chapters: [
      {
        id: "artemis-1",
        title: "Hybrid Free-Return Trajectory",
        body: "Four astronauts aboard Orion Integrity perform a high-earth orbit checkout before firing the European Service Module for a figure-eight lunar free-return trajectory 4,700 miles beyond the far side of the Moon.",
        era: "Artemis Program",
        location: "Earth–Moon Cislunar Space",
        sourceLabel: "NASA Artemis II Mission Architecture",
        accentColor: "#3B82F6",
      },
    ],
  },
  {
    id: "2008824210319364",
    title: "Westward Expansion and Manifest Destiny",
    subtitle: "Overland trails, the Transcontinental Railroad, and Indigenous sovereignty struggles.",
    category: "Interactive Story",
    thumbnailLabel: "19th-Century Frontier",
    accentGradient: "from-orange-900 via-amber-950 to-stone-900",
    href: "/atlas/session/2008824210319364",
    chapters: [
      {
        id: "west-1",
        title: "Promontory Summit & the Iron Horse",
        body: "On May 10, 1869, the Union Pacific and Central Pacific railroads met at Promontory Summit, Utah, shrinking a six-month continent crossing into a seven-day rail journey while transforming Plains ecosystems.",
        era: "1803–1890",
        location: "Great Plains & American West",
        sourceLabel: "Library of Congress Western History Collection",
        accentColor: "#EA580C",
      },
    ],
  },
  {
    id: "2008824210321924",
    title: "The Pacific War and the U.S. in WWII",
    subtitle: "Carrier battles, industrial mobilization, and the Coral Sea to Tokyo Bay arc.",
    category: "Interactive Story",
    thumbnailLabel: "Pacific Theater",
    accentGradient: "from-slate-900 via-cyan-950 to-blue-950",
    href: "/atlas/session/2008824210321924",
    chapters: [
      {
        id: "pac-1",
        title: "The Five Minutes at Midway",
        body: "Station HYPO cryptanalysts broke the JN-25b naval code, allowing U.S. carrier dive-bombers on June 4, 1942 to turn the strategic tide in the central Pacific.",
        era: "1941–1945",
        location: "Midway Atoll, Pacific Ocean",
        sourceLabel: "U.S. Naval History and Heritage Command",
        accentColor: "#0284C7",
      },
    ],
  },
  {
    id: "2008824210326020",
    title: "Martin Luther King Jr. and the Civil Rights Movement",
    subtitle: "From Montgomery and Birmingham to the 1963 March on Washington and Voting Rights Act.",
    category: "Interactive Story",
    thumbnailLabel: "Civil Rights Landmarks",
    accentGradient: "from-purple-950 via-indigo-950 to-slate-900",
    href: "/atlas/session/2008824210326020",
    chapters: [
      {
        id: "mlk-1",
        title: "Nonviolent Direct Action & Letter from Birmingham Jail",
        body: "Articulating the moral imperative to challenge unjust segregation statutes, Dr. King's coalition catalyzed the Civil Rights Act of 1964 and the Voting Rights Act of 1965.",
        era: "1955–1968",
        location: "Montgomery · Birmingham · Washington, D.C.",
        sourceLabel: "The King Center Digital Archive",
        accentColor: "#7C3AED",
      },
    ],
  },
  {
    id: "2008824210328580",
    title: "First Time in Milan Travel Map",
    subtitle: "Architectural spatial guide from the Duomo di Milano and Galleria Vittorio Emanuele II to Santa Maria delle Grazie.",
    category: "Interactive Story",
    thumbnailLabel: "Milan Spatial Guide",
    accentGradient: "from-emerald-950 via-teal-900 to-slate-900",
    href: "/atlas/session/2008824210328580",
    chapters: [
      {
        id: "milan-1",
        title: "Radial Piazza del Duomo & Renaissance Masterworks",
        body: "Six centuries of Candoglia marble craftsmanship crown the Duomo's 135 spires, steps away from Leonardo da Vinci's Last Supper refectory.",
        era: "1386–Present",
        location: "Milan, Lombardy, Italy",
        sourceLabel: "Veneranda Fabbrica del Duomo di Milano",
        accentColor: "#10B981",
      },
    ],
  },
  {
    id: "2008824210336004",
    title: "The Roman Empire and Its Infrastructure",
    subtitle: "Aqueduct gradients, pozzolana hydraulic concrete, and 50,000 miles of stone-paved viae.",
    category: "Interactive Story",
    thumbnailLabel: "Roman Engineering",
    accentGradient: "from-red-950 via-amber-900 to-stone-900",
    href: "/atlas/session/2008824210336004",
    chapters: [
      {
        id: "rome-1",
        title: "Opus Caementicium & the Pont du Gard",
        body: "By blending volcanic ash (pozzolana) with lime and seawater, Roman engineers cast self-healing harbor piers, unreinforced domes like the Pantheon, and gravity-fed aqueducts.",
        era: "27 BCE – 476 CE",
        location: "Rome · Nîmes · Constantinople",
        sourceLabel: "Vitruvius, De Architectura",
        accentColor: "#DC2626",
      },
    ],
  },
  {
    id: "2008824210342660",
    title: "Atlantis: The Legendary Island Civilization",
    subtitle: "Plato's Timaeus and Critias allegory alongside Bronze Age Minoan Thera vulcanology.",
    category: "Interactive Story",
    thumbnailLabel: "Myth & Archaeology",
    accentGradient: "from-cyan-950 via-blue-900 to-indigo-950",
    href: "/atlas/session/2008824210342660",
    chapters: [
      {
        id: "atlantis-1",
        title: "Concentric Rings of Plato's Philosophical Allegory",
        body: "Written c. 360 BCE in Timaeus and Critias, Plato contrasted an idealized ancient Athens with hubristic imperial power, while modern geologists study the ~1600 BCE eruption of Santorini (Thera).",
        era: "360 BCE Literary Text",
        location: "Athens & Aegean Sea",
        sourceLabel: "Plato, Critias & Akrotiri Excavations",
        accentColor: "#0EA5E9",
      },
    ],
  },
  {
    id: "2008824210345220",
    title: "The Ancient City of Babylon",
    subtitle: "The Ishtar Gate glazed brick reliefs, Processional Way, and Neo-Babylonian astronomy.",
    category: "Interactive Story",
    thumbnailLabel: "Mesopotamian Metropolis",
    accentGradient: "from-blue-950 via-amber-900 to-yellow-950",
    href: "/atlas/session/2008824210345220",
    chapters: [
      {
        id: "babylon-1",
        title: "Lapis-Glazed Brick of the Ishtar Gate",
        body: "Commissioned under Nebuchadnezzar II (c. 575 BCE), molded cobalt-blue glazed bricks depicted alternating rows of mušḫuššu dragons (Marduk) and aurochs (Adad).",
        era: "626–539 BCE",
        location: "Babylon, Euphrates Valley",
        sourceLabel: "Vorderasiatisches Museum Archaeological Survey",
        accentColor: "#2563EB",
      },
    ],
  },
  {
    id: "2008824210348292",
    title: "Life and Legacy of Albert Einstein",
    subtitle: "The 1905 Annus Mirabilis papers, curved spacetime, and the 1919 solar eclipse confirmation.",
    category: "Interactive Story",
    thumbnailLabel: "Relativity & Spacetime",
    accentGradient: "from-violet-950 via-slate-900 to-indigo-950",
    href: "/atlas/session/2008824210348292",
    chapters: [
      {
        id: "einstein-1",
        title: "1905 Bern Patent Office & the Photoelectric Effect",
        body: "In a single year, Einstein published four groundbreaking papers on light quanta, Brownian motion, special relativity, and mass-energy equivalence (E = mc²).",
        era: "1879–1955",
        location: "Bern · Berlin · Princeton",
        sourceLabel: "Albert Einstein Archives, Hebrew University",
        accentColor: "#8B5CF6",
      },
    ],
  },
  {
    id: "2008824210351620",
    title: "Giant Panda Infographic",
    subtitle: "Pseudo-thumb wrist bone anatomy, bamboo trophic ecology, and Sichuan montane corridors.",
    category: "Interactive Story",
    thumbnailLabel: "Conservation & Anatomy",
    accentGradient: "from-emerald-950 via-green-900 to-teal-950",
    href: "/atlas/session/2008824210351620",
    chapters: [
      {
        id: "panda-1",
        title: "The Radial Sesamoid 'Sixth Finger'",
        body: "An enlarged radial sesamoid wrist bone functions as an opposable thumb, allowing Ailuropoda melanoleuca to grip and strip up to 38 kg of fibrous bamboo shoots daily.",
        era: "Evolutionary Ecology",
        location: "Minshan & Qinling Mountains, China",
        sourceLabel: "IUCN & Giant Panda National Park Ecological Survey",
        accentColor: "#16A34A",
      },
    ],
  },
  {
    id: "2008824210355204",
    title: "Rosa Parks and the Montgomery Bus Boycott",
    subtitle: "381 days of coordinated community carpools and Browder v. Gayle constitutional victory.",
    category: "Interactive Story",
    thumbnailLabel: "Montgomery 1955–1956",
    accentGradient: "from-rose-950 via-red-900 to-slate-900",
    href: "/atlas/session/2008824210355204",
    chapters: [
      {
        id: "rosa-1",
        title: "December 1, 1955 & the Women's Political Council",
        body: "Following Rosa Parks' arrest on Bus #2857, Jo Ann Robinson and the Montgomery Improvement Association organized 40,000 Black riders in a 381-day boycott culminating in the Supreme Court ruling against segregated transit.",
        era: "1955–1956",
        location: "Montgomery, Alabama",
        sourceLabel: "Library of Congress Rosa Parks Papers",
        accentColor: "#E11D48",
      },
    ],
  },
];

export const ATLAS_FAQ_ITEMS = [
  {
    question: "What is the best AI tool for visual learning?",
    answer:
      "Gauth Atlas is purpose-built for visual learning—transforming any historical event, scientific mechanism, literary world, or geographic topic into an interactive spatial canvas with grounded imagery, timelines, and multi-language AI video synthesis.",
  },
  {
    question: "How can I learn complex topics in a visual way?",
    answer:
      "Instead of reading walls of text, enter any prompt in Gauth Atlas to generate interconnected visual story cards, interactive timelines, and spatial maps where you can zoom into any concept node.",
  },
  {
    question: "What kinds of topics can Gauth Atlas cover?",
    answer:
      "Gauth Atlas covers AP US & World History, Biology, Chemistry, Physics, Literature, Geography, Art History, Economics, and custom interdisciplinary research prompts.",
  },
  {
    question: "How does Gauth Atlas present information?",
    answer:
      "Atlas combines a spatial View canvas, structured Details chapters, a 16-language AI Video Story generator, and the Interactive AP US History World Map with 100+ chronological knowledge points.",
  },
  {
    question: "Is Gauth Atlas available online, and how do I use it?",
    answer:
      "Yes! Gauth Atlas runs directly in your browser on desktop and mobile. Simply type any topic in the prompt bar, explore a Popular Story, or open the Interactive AP US History Map.",
  },
  {
    question: "What does using Atlas actually look like?",
    answer:
      "You start with a visual story overview, click any chapter thumbnail (like 'The Crucible's Breath' or 'Alchemy of Cobalt') to inspect high-resolution diagrams and primary sources, or click 'Generate Video' to produce a narrated video summary.",
  },
];

export const FEATURED_WORLD_MAP_POIS: WorldMapPoiItem[] = (
  worldMapPoisJson as WorldMapPoiItem[]
).map((p) => ({
  ...p,
  source: "Featured",
}));

export function findAtlasSessionById(id: string): AtlasSessionItem {
  const all = [...ATLAS_INTERACTIVE_SESSIONS, ...ATLAS_VIDEO_STORIES];
  const found = all.find((s) => s.id === id);
  if (found) return found;

  const cleanTopic = decodeURIComponent(id)
    .replace(/^custom-/, "")
    .replace(/-/g, " ");
  return buildCustomAtlasSession(cleanTopic || "Empires of the Silk Roads", id);
}

export function buildCustomAtlasSession(prompt: string, customId?: string): AtlasSessionItem {
  const title = prompt.trim() || "Interactive Visual Story";
  const id = customId || `session-${Date.now()}`;
  return {
    id,
    title,
    subtitle: `AI-Generated Spatial Visual Story · Grounded in Sources`,
    category: "Interactive Story",
    thumbnailLabel: title.slice(0, 28),
    accentGradient: "from-indigo-950 via-blue-900 to-slate-900",
    href: `/atlas/session/${id}`,
    chapters: [
      {
        id: `${id}-ch-1`,
        title: `Origins & Context of ${title}`,
        body: `Every pivotal transformation in ${title} begins with the convergence of environmental conditions, human ingenuity, and institutional catalysts that set the stage for lasting change.`,
        era: "Foundational Era",
        location: "Primary Geographic Nexus",
        sourceLabel: "Primary Historical & Scientific Archive",
        accentColor: "#2563EB",
      },
      {
        id: `${id}-ch-2`,
        title: `Core Mechanism & Turning Point`,
        body: `At the decisive inflection point of ${title}, structural forces interacted to accelerate adoption, reshape regional networks, and establish new governing principles.`,
        era: "Peak Transformation",
        location: "Core Exchange Corridor",
        sourceLabel: "Peer-Reviewed Synthesis Corpus",
        accentColor: "#7C3AED",
      },
      {
        id: `${id}-ch-3`,
        title: `Global Ripple Effects`,
        body: `As ${title} spread across neighboring systems, it triggered secondary innovations in technology, economic organization, and cultural expression.`,
        era: "Diffusion Phase",
        location: "Transregional Network",
        sourceLabel: "Comparative Global Studies",
        accentColor: "#059669",
      },
      {
        id: `${id}-ch-4`,
        title: `Enduring Legacy Today`,
        body: `The long-term legacy of ${title} remains visible in modern institutions, scientific frameworks, and the foundational curricula studied worldwide.`,
        era: "Modern Synthesis",
        location: "Global Impact",
        sourceLabel: "Contemporary Academic Reference",
        accentColor: "#EA580C",
      },
    ],
  };
}
