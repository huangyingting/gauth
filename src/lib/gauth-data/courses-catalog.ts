import mathCurriculumsJson from "./math-curriculums.json";

export interface CourseLessonBlock {
  id: string;
  chapterTitle: string;
  heading: string;
  subheading: string;
  narration: string;
  formula?: string;
  simulationType: "flight" | "optics" | "wave" | "cell" | "atom" | "heart" | "history" | "math";
  interactiveLabel: string;
  sliderLabel: string;
  sliderMin: number;
  sliderMax: number;
  sliderDefault: number;
  sliderUnit: string;
  quizQuestion: string;
  quizOptions: string[];
  quizCorrectIndex: number;
  quizExplanation: string;
}

export interface AcademyCourseItem {
  slug: string;
  title: string;
  subtitle: string;
  category: "science" | "math" | "history" | "my";
  section: string;
  badge: string;
  accentColor: string;
  href: string;
  blocks: CourseLessonBlock[];
}

export interface MathLessonItem {
  slug: string;
  title: string;
  href: string;
}

export interface MathUnitItem {
  unitNumber: number;
  slug: string;
  title: string;
  topicsCount: number;
  lessons: MathLessonItem[];
}

export interface MathCurriculumTrack {
  slug: string;
  title: string;
  subtitle: string;
  lessonsCount: number;
  lessonCount: number;
  unitCount: number;
  topicsCount: number;
  units: MathUnitItem[];
}

export const MATH_CURRICULUM_MAP: Record<string, MathCurriculumTrack> =
  Object.fromEntries(
    Object.entries(
      mathCurriculumsJson as Record<string, Omit<MathCurriculumTrack, "lessonCount" | "unitCount">>
    ).map(([k, v]) => [
      k,
      {
        ...v,
        lessonCount: v.lessonsCount,
        unitCount: v.units.length,
      },
    ])
  );

export const MATH_CURRICULUMS: MathCurriculumTrack[] =
  Object.values(MATH_CURRICULUM_MAP);

export const SCIENCE_LABS_SECTIONS = [
  {
    id: "how-things-work",
    title: "How Things Work",
    subtitle: "Interactive physics simulations uncovering everyday engineering phenomena.",
  },
  {
    id: "biology",
    title: "Biology",
    subtitle: "Explore cellular machinery, organelles, membrane transport, and energy conversion.",
  },
  {
    id: "chemistry",
    title: "Chemistry",
    subtitle: "Visualize subatomic structure, periodic table trends, and chemical reactivity.",
  },
  {
    id: "medicine",
    title: "Medicine",
    subtitle: "Master human anatomy, cardiac hemodynamics, and respiratory physiology.",
  },
];

export const SCIENCE_COURSES: AcademyCourseItem[] = [
  // How Things Work
  {
    slug: "how-things-work-1",
    title: "The Sweet Spot",
    subtitle: "Higher isn’t always better. Find the altitude that saves fuel.",
    category: "science",
    section: "How Things Work",
    badge: "Physics",
    accentColor: "#2563EB",
    href: "/course/science/how-things-work-1/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "flight_chapter-sweet-spot",
        chapterTitle: "The Sweet Spot",
        heading: "Does Flying Higher Always Save Fuel?",
        subheading: "Picture a long-haul jet in cruise. Thinner air means less drag—so should the pilots keep climbing until the airplane reaches its ceiling?",
        narration: "As a commercial airliner climbs toward 36,000 feet, air density drops exponentially. Less air resistance reduces parasitic drag, but jet engines also need oxygen to sustain thrust efficiently.",
        formula: "D = \\frac{1}{2} \\rho v^2 C_D A",
        simulationType: "flight",
        interactiveLabel: "Cruise Altitude & Fuel Burn Optimizer",
        sliderLabel: "Cruise Altitude",
        sliderMin: 10000,
        sliderMax: 45000,
        sliderDefault: 35000,
        sliderUnit: "ft",
        quizQuestion: "Why does climbing above the optimal cruise altitude (~35,000–39,000 ft) eventually increase fuel burn?",
        quizOptions: [
          "Parasitic drag suddenly increases in the stratosphere",
          "Induced drag rises and turbofan engine thrust efficiency drops in overly thin air",
          "Gravity becomes stronger at higher altitudes",
          "Fuel freezes inside the wings above 38,000 ft",
        ],
        quizCorrectIndex: 1,
        quizExplanation: "In very thin air, maintaining lift requires a higher angle of attack (increasing induced drag) while turbofan engines must work harder for oxygen.",
      },
      {
        id: "flight_chapter-thin-air",
        chapterTitle: "The Thin Air Advantage",
        heading: "How Air Density Shapes Aerodynamic Drag",
        subheading: "Air molecules resist the forward motion of the fuselage and wings. Halving air density cuts parasitic drag in half at the same true airspeed.",
        narration: "At 35,000 feet, air density is roughly one-quarter of sea-level density. This allows airliners to fly fast while burning significantly less fuel per mile.",
        formula: "\\rho(h) \\approx \\rho_0 e^{-h / H}",
        simulationType: "flight",
        interactiveLabel: "Air Density vs Parasitic Drag Curve",
        sliderLabel: "Airspeed (Mach)",
        sliderMin: 50,
        sliderMax: 90,
        sliderDefault: 78,
        sliderUnit: "% Mach",
        quizQuestion: "If air density is reduced by 50% at constant speed, what happens to parasitic drag?",
        quizOptions: ["It doubles", "It is cut in half", "It stays unchanged", "It drops to zero"],
        quizCorrectIndex: 1,
        quizExplanation: "Parasitic drag is directly proportional to air density ρ.",
      },
      {
        id: "flight_chapter-engine",
        chapterTitle: "The Engine's Breath",
        heading: "Turbofan Thermal Efficiency in Cold Stratospheric Air",
        subheading: "Cold ambient temperatures at altitude improve Carnot thermal efficiency, up until oxygen scarcity limits combustion.",
        narration: "Jet engines act as Brayton-cycle heat engines: colder intake air at -55°C boosts thermal efficiency before compressor limits take over.",
        formula: "\\eta_{th} = 1 - \\frac{T_{ambient}}{T_{turbine}}",
        simulationType: "flight",
        interactiveLabel: "Turbofan Bypass & Oxygen Intake Simulator",
        sliderLabel: "Throttle N1",
        sliderMin: 60,
        sliderMax: 100,
        sliderDefault: 84,
        sliderUnit: "%",
        quizQuestion: "How does cold ambient air at 35,000 ft help a turbofan engine?",
        quizOptions: [
          "It improves the thermodynamic temperature ratio across the engine",
          "It increases cabin pressure automatically",
          "It eliminates the need for fan blades",
          "It makes jet fuel heavier",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "A lower intake temperature increases the thermal efficiency of the Brayton cycle.",
      },
      {
        id: "flight_chapter-balance",
        chapterTitle: "Finding the Balance",
        heading: "The Coffin Corner & Step Climbs",
        subheading: "As fuel burns off and the aircraft gets lighter, the optimal 'sweet spot' altitude gradually rises.",
        narration: "Long-haul flights perform step climbs—ascending from 33,000 ft to 37,000 ft and 39,000 ft as fuel weight decreases over the ocean.",
        formula: "L = W = \\frac{1}{2} \\rho v^2 C_L A",
        simulationType: "flight",
        interactiveLabel: "Aircraft Weight Step-Climb Planner",
        sliderLabel: "Remaining Fuel Load",
        sliderMin: 10,
        sliderMax: 100,
        sliderDefault: 45,
        sliderUnit: "%",
        quizQuestion: "Why do long-haul pilots perform 'step climbs' as the flight progresses?",
        quizOptions: [
          "Because burning fuel reduces aircraft weight, raising the optimal lift-to-drag altitude",
          "To avoid radio interference",
          "Because the destination airport is at a higher elevation",
          "To recharge the aircraft batteries",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "A lighter airplane needs less lift, allowing it to cruise efficiently in even thinner air higher up.",
      },
    ],
  },
  {
    slug: "how-things-work-2",
    title: "Bending the Light",
    subtitle: "Light changes direction. Lenses turn it into focus.",
    category: "science",
    section: "How Things Work",
    badge: "Physics",
    accentColor: "#0EA5E9",
    href: "/course/science/how-things-work-2/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "optics_snell",
        chapterTitle: "Refraction at the Boundary",
        heading: "Why Does Light Bend When Entering Glass?",
        subheading: "When a wavefront slows down across an optical boundary, its angle shifts according to Snell's Law.",
        narration: "Light travels at c in vacuum, but slows down in water (n=1.33) and crown glass (n=1.52), causing the ray to bend toward the normal.",
        formula: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
        simulationType: "optics",
        interactiveLabel: "Snell's Law & Focal Length Ray Tracer",
        sliderLabel: "Incident Angle θ₁",
        sliderMin: 5,
        sliderMax: 80,
        sliderDefault: 35,
        sliderUnit: "°",
        quizQuestion: "When light passes from air (n=1.00) into glass (n=1.52) at an angle, which way does it bend?",
        quizOptions: ["Toward the normal", "Away from the normal", "It reflects 100%", "It does not bend"],
        quizCorrectIndex: 0,
        quizExplanation: "Entering a higher-index medium slows the wave and bends the ray toward the normal.",
      },
      {
        id: "optics_lens",
        chapterTitle: "Convex vs Concave Lenses",
        heading: "Converging Parallel Rays to a Focal Point",
        subheading: "Curved glass surfaces apply Snell's Law twice—at entry and exit—to focus an image onto a sensor or retina.",
        narration: "By shaping the curvature of both lens surfaces, we control the focal length f using the Lensmaker's Equation.",
        formula: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}",
        simulationType: "optics",
        interactiveLabel: "Thin Lens Focal Simulator",
        sliderLabel: "Focal Length f",
        sliderMin: 20,
        sliderMax: 150,
        sliderDefault: 60,
        sliderUnit: "mm",
        quizQuestion: "If an object is placed at 2f from a converging lens, where does the real image form?",
        quizOptions: ["At f", "At 2f on the opposite side", "At infinity", "Inside the lens"],
        quizCorrectIndex: 1,
        quizExplanation: "By the thin-lens equation, 1/f = 1/(2f) + 1/di gives di = 2f.",
      },
    ],
  },
  {
    slug: "how-things-work-3",
    title: "How Noise-Cancelling Headphones Work",
    subtitle: "Add a sound wave. Take the noise away.",
    category: "science",
    section: "How Things Work",
    badge: "Physics",
    accentColor: "#6366F1",
    href: "/course/science/how-things-work-3/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "wave_superposition",
        chapterTitle: "Destructive Interference",
        heading: "Fighting Sound with Anti-Sound",
        subheading: "Active Noise Cancellation (ANC) samples external pressure waves and emits an inverted 180° phase-shifted wave.",
        narration: "When a compression peak meets an equal rarefaction trough, the two acoustic waves sum to silence.",
        formula: "y_{net}(t) = A\\sin(\\omega t) + A\\sin(\\omega t + \\pi) = 0",
        simulationType: "wave",
        interactiveLabel: "Phase Shift & Destructive Interference Lab",
        sliderLabel: "Anti-Noise Phase Shift",
        sliderMin: 0,
        sliderMax: 360,
        sliderDefault: 180,
        sliderUnit: "°",
        quizQuestion: "What phase difference produces complete destructive interference between two identical sound waves?",
        quizOptions: ["0°", "90°", "180° (π radians)", "360°"],
        quizCorrectIndex: 2,
        quizExplanation: "A 180° phase inversion aligns every crest with a trough, cancelling the net amplitude.",
      },
    ],
  },
  // Biology
  {
    slug: "golgi-apparatus-and-protein-sorting",
    title: "Golgi Apparatus and Protein Sorting",
    subtitle: "Made is not the same as delivered",
    category: "science",
    section: "Biology",
    badge: "Biology",
    accentColor: "#10B981",
    href: "/course/science/golgi-apparatus-and-protein-sorting/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "golgi_1",
        chapterTitle: "Made is not the same as delivered.",
        heading: "Protein Delivery",
        subheading: "Ribosomes synthesize polypeptides in the rough ER, but the Golgi apparatus tags, modifies, and routes them to their exact cellular destination.",
        narration: "Vesicles bud off the Rough ER and fuse with the cis-Golgi face. Inside the cisternae, enzymes attach carbohydrate tags like mannose-6-phosphate.",
        simulationType: "cell",
        interactiveLabel: "Cis-to-Trans Golgi Vesicle Trafficking Simulator",
        sliderLabel: "Glycosylation Rate",
        sliderMin: 10,
        sliderMax: 100,
        sliderDefault: 75,
        sliderUnit: "%",
        quizQuestion: "Which molecular tag does the Golgi apparatus use to route hydrolytic enzymes specifically to lysosomes?",
        quizOptions: ["Mannose-6-phosphate (M6P)", "ATP synthase", "Hemoglobin", "Cholesterol"],
        quizCorrectIndex: 0,
        quizExplanation: "Mannose-6-phosphate tags are recognized by trans-Golgi receptors that package lysosomal enzymes into clathrin-coated vesicles.",
      },
      {
        id: "golgi_2",
        chapterTitle: "Receive. Refine. Route.",
        heading: "Cis, Medial, and Trans Cisternae",
        subheading: "Each stack of the Golgi contains specialized resident enzymes that sequentially trim and build oligosaccharide chains.",
        narration: "By the time a cargo protein reaches the trans-Golgi network (TGN), its molecular address label determines whether it is secreted, embedded in the plasma membrane, or sent to an organelle.",
        simulationType: "cell",
        interactiveLabel: "Trans-Golgi Sorting Network",
        sliderLabel: "Vesicle Budding Flux",
        sliderMin: 1,
        sliderMax: 50,
        sliderDefault: 24,
        sliderUnit: "vesicles/s",
        quizQuestion: "Which face of the Golgi apparatus receives incoming transport vesicles from the endoplasmic reticulum?",
        quizOptions: ["The cis face", "The trans face", "The nuclear pore", "The cristae"],
        quizCorrectIndex: 0,
        quizExplanation: "Transport vesicles from the ER arrive at the cis-Golgi and exit from the trans-Golgi network.",
      },
      {
        id: "golgi_3",
        chapterTitle: "One change. One clear explanation.",
        heading: "What Happens When Sorting Tags Fail?",
        subheading: "In I-cell disease, missing phosphotransferase activity leaves lysosomal enzymes untagged—causing them to be secreted outside the cell by default.",
        narration: "Without the mannose-6-phosphate tag, hydrolases follow the constitutive secretory pathway instead of reaching lysosomes.",
        simulationType: "cell",
        interactiveLabel: "Wild-Type vs I-Cell Sorting Comparison",
        sliderLabel: "Enzyme Tag Fidelity",
        sliderMin: 0,
        sliderMax: 100,
        sliderDefault: 100,
        sliderUnit: "%",
        quizQuestion: "What happens to lysosomal enzymes if their mannose-6-phosphate tag is not added in the Golgi?",
        quizOptions: [
          "They are secreted outside the cell via the default pathway",
          "They turn into DNA",
          "They stay inside the ribosome forever",
          "They replicate mitochondria",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Untagged luminal proteins are exported via default exocytosis.",
      },
    ],
  },
  {
    slug: "cell-membrane-and-transport",
    title: "Cell Membrane and Transport",
    subtitle: "How the lipid bilayer guards the cell.",
    category: "science",
    section: "Biology",
    badge: "Biology",
    accentColor: "#059669",
    href: "/course/science/cell-membrane-and-transport/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "membrane_1",
        chapterTitle: "Selective Permeability",
        heading: "The Fluid Mosaic Phospholipid Bilayer",
        subheading: "Hydrophilic heads face outward toward water while hydrophobic fatty-acid tails form an interior barrier to ions and polar molecules.",
        narration: "Small nonpolar gases like O₂ and CO₂ diffuse freely across the bilayer, whereas ions require dedicated channel or carrier proteins.",
        simulationType: "cell",
        interactiveLabel: "Membrane Diffusion & Na+/K+ Pump Simulator",
        sliderLabel: "Extracellular Solute Gradient",
        sliderMin: 0,
        sliderMax: 100,
        sliderDefault: 60,
        sliderUnit: "mM",
        quizQuestion: "Which molecule crosses the phospholipid bilayer fastest by simple diffusion without a transport protein?",
        quizOptions: ["O₂ (Oxygen gas)", "Na⁺ ion", "Glucose", "ATP"],
        quizCorrectIndex: 0,
        quizExplanation: "Small, nonpolar molecules like O₂ and CO₂ dissolve easily through the hydrophobic core.",
      },
    ],
  },
  {
    slug: "chloroplasts-and-photosynthesis",
    title: "Chloroplasts and Photosynthesis",
    subtitle: "Turning sunlight into chemical energy.",
    category: "science",
    section: "Biology",
    badge: "Biology",
    accentColor: "#16A34A",
    href: "/course/science/chloroplasts-and-photosynthesis/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "chloro_1",
        chapterTitle: "Light Reactions & Calvin Cycle",
        heading: "From Thylakoid Membranes to the Stroma",
        subheading: "Photosystems II and I capture photons to split water and generate ATP and NADPH, powering carbon fixation in the Calvin cycle.",
        narration: "Inside the thylakoid lumen, a proton gradient drives ATP synthase, while Rubisco fixes CO₂ into G3P sugars in the stroma.",
        formula: "6CO_2 + 6H_2O + \\text{light} \\rightarrow C_6H_{12}O_6 + 6O_2",
        simulationType: "cell",
        interactiveLabel: "Photon Flux & Photosynthetic O₂ Output Lab",
        sliderLabel: "Light Intensity (PAR)",
        sliderMin: 0,
        sliderMax: 1500,
        sliderDefault: 800,
        sliderUnit: "μmol/m²s",
        quizQuestion: "Where do the light-dependent reactions of photosynthesis take place?",
        quizOptions: ["Thylakoid membrane", "Stroma", "Mitochondrial matrix", "Cytoplasm"],
        quizCorrectIndex: 0,
        quizExplanation: "Chlorophyll and the photosynthetic electron transport chain are embedded in the thylakoid membrane.",
      },
    ],
  },
  // Chemistry
  {
    slug: "atomic-number-and-element-identity",
    title: "Atomic Number and Element Identity",
    subtitle: "Change the proton count, change the element.",
    category: "science",
    section: "Chemistry",
    badge: "Chemistry",
    accentColor: "#F59E0B",
    href: "/course/science/atomic-number-and-element-identity/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "atom_1",
        chapterTitle: "Protons Define the Element",
        heading: "Atomic Number (Z) vs Mass Number (A)",
        subheading: "Every carbon atom has exactly 6 protons. Changing neutrons creates isotopes; changing electrons creates ions; changing protons changes the element itself.",
        narration: "Nuclear charge Z governs the electrostatic attraction that shapes electron shells and chemical bonding.",
        formula: "A = Z + N",
        simulationType: "atom",
        interactiveLabel: "Interactive Nucleus & Electron Shell Builder",
        sliderLabel: "Proton Count (Z)",
        sliderMin: 1,
        sliderMax: 18,
        sliderDefault: 6,
        sliderUnit: "protons",
        quizQuestion: "An atom has 8 protons, 9 neutrons, and 10 electrons. What element is it?",
        quizOptions: ["Oxygen (Z=8)", "Fluorine (Z=9)", "Neon (Z=10)", "Carbon (Z=6)"],
        quizCorrectIndex: 0,
        quizExplanation: "Element identity is uniquely determined by the number of protons (Z=8 is Oxygen).",
      },
    ],
  },
  {
    slug: "alkali-metal-trends-down-a-group",
    title: "Alkali Metal Trends Down a Group",
    subtitle: "Why Group 1 metals get more explosive down the column.",
    category: "science",
    section: "Chemistry",
    badge: "Chemistry",
    accentColor: "#D97706",
    href: "/course/science/alkali-metal-trends-down-a-group/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "alkali_1",
        chapterTitle: "Electron Shielding & Reactivity",
        heading: "From Lithium to Cesium",
        subheading: "Each step down Group 1 adds a full electron shell, increasing atomic radius and weakening the hold on the outermost s¹ valence electron.",
        narration: "Because the lone valence electron is farther from the nucleus and shielded by inner shells, ionization energy drops and water reactivity surges.",
        formula: "2M(s) + 2H_2O(l) \\rightarrow 2MOH(aq) + H_2(g)",
        simulationType: "atom",
        interactiveLabel: "Group 1 Ionization & Water Reaction Simulator",
        sliderLabel: "Period n (Li=2 to Cs=6)",
        sliderMin: 2,
        sliderMax: 6,
        sliderDefault: 3,
        sliderUnit: "shell",
        quizQuestion: "Why is potassium (K) more reactive with water than lithium (Li)?",
        quizOptions: [
          "Potassium's valence electron is farther from the nucleus and more shielded, so it is lost more easily",
          "Potassium has more valence electrons than lithium",
          "Potassium is a noble gas",
          "Lithium has a larger atomic radius than potassium",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Lower first ionization energy down Group 1 makes electron loss much faster.",
      },
    ],
  },
  {
    slug: "trends-across-period-3",
    title: "Trends Across Period 3",
    subtitle: "From metallic sodium to nonmetallic argon.",
    category: "science",
    section: "Chemistry",
    badge: "Chemistry",
    accentColor: "#EA580C",
    href: "/course/science/trends-across-period-3/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "period3_1",
        chapterTitle: "Effective Nuclear Charge (Zeff)",
        heading: "Shrinking Radii Across a Row",
        subheading: "Moving from Na (Z=11) to Ar (Z=18) adds protons to the nucleus while electrons enter the same n=3 shell, pulling the electron cloud tighter.",
        narration: "Higher effective nuclear charge contracts atomic radius and increases electronegativity across Period 3.",
        formula: "Z_{eff} = Z - S",
        simulationType: "atom",
        interactiveLabel: "Period 3 Effective Nuclear Charge Explorer",
        sliderLabel: "Atomic Number (Na=11 to Ar=18)",
        sliderMin: 11,
        sliderMax: 18,
        sliderDefault: 14,
        sliderUnit: "Z",
        quizQuestion: "As you move from left to right across Period 3 (Na to Cl), how does atomic radius change?",
        quizOptions: ["It decreases", "It increases", "It stays constant", "It oscillates randomly"],
        quizCorrectIndex: 0,
        quizExplanation: "Increasing nuclear charge with constant core shielding pulls the n=3 shell closer.",
      },
    ],
  },
  // Medicine
  {
    slug: "heart-pumps-and-blood-circulation",
    title: "Heart Pumps and Blood Circulation",
    subtitle: "Two pumps beating as one.",
    category: "science",
    section: "Medicine",
    badge: "Nursing",
    accentColor: "#EF4444",
    href: "/course/science/heart-pumps-and-blood-circulation/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "heart_1",
        chapterTitle: "Pulmonary vs Systemic Circuits",
        heading: "Right Heart to Lungs, Left Heart to Body",
        subheading: "The right ventricle pumps deoxygenated blood at low pressure to the lungs, while the thick-walled left ventricle pumps oxygenated blood at high pressure to systemic organs.",
        narration: "One-way AV (tricuspid, mitral) and semilunar (pulmonary, aortic) valves prevent backflow during systole and diastole.",
        formula: "CO = HR \\times SV",
        simulationType: "heart",
        interactiveLabel: "Cardiac Cycle & Valve Pressure Simulator",
        sliderLabel: "Heart Rate (BPM)",
        sliderMin: 45,
        sliderMax: 180,
        sliderDefault: 72,
        sliderUnit: "bpm",
        quizQuestion: "Which chamber of the heart has the thickest myocardial wall to generate high systemic arterial pressure?",
        quizOptions: ["Left ventricle", "Right atrium", "Right ventricle", "Left atrium"],
        quizCorrectIndex: 0,
        quizExplanation: "The left ventricle must overcome systemic vascular resistance (~120 mmHg systolic).",
      },
    ],
  },
  {
    slug: "coronary-blood-supply",
    title: "Coronary Blood Supply",
    subtitle: "How the heart feeds itself during relaxation.",
    category: "science",
    section: "Medicine",
    badge: "Nursing",
    accentColor: "#DC2626",
    href: "/course/science/coronary-blood-supply/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "coronary_1",
        chapterTitle: "Diastolic Perfusion",
        heading: "Why Left Ventricular Muscle Perfuses During Diastole",
        subheading: "During systole, contracting myocardium compresses intramyocardial vessels. When the aortic valve closes in diastole, elastic recoil drives blood into the left and right coronary arteries.",
        narration: "Severe tachycardia shortens diastole disproportionately, reducing coronary filling time and risking myocardial ischemia.",
        simulationType: "heart",
        interactiveLabel: "Coronary Artery Perfusion & Diastolic Time Lab",
        sliderLabel: "Diastolic Filling Fraction",
        sliderMin: 20,
        sliderMax: 70,
        sliderDefault: 55,
        sliderUnit: "%",
        quizQuestion: "During which phase of the cardiac cycle does the left ventricular myocardium receive most of its coronary blood flow?",
        quizOptions: ["Ventricular diastole", "Isovolumetric contraction", "Peak ventricular ejection", "Atrial depolarization"],
        quizCorrectIndex: 0,
        quizExplanation: "Myocardial relaxation during diastole relieves vessel compression while aortic root pressure stays perfusing.",
      },
    ],
  },
  {
    slug: "diaphragm-movement-and-inhalation",
    title: "Diaphragm Movement and Inhalation",
    subtitle: "Expand the volume. Let atmospheric pressure do the rest.",
    category: "science",
    section: "Medicine",
    badge: "Nursing",
    accentColor: "#EC4899",
    href: "/course/science/diaphragm-movement-and-inhalation/learn?entry_source=start&from=science",
    blocks: [
      {
        id: "diaphragm_1",
        chapterTitle: "Boyle's Law in the Thorax",
        heading: "Negative-Pressure Breathing",
        subheading: "When the dome-shaped diaphragm contracts and flattens downward, thoracic volume increases, dropping intrapulmonary pressure below atmospheric pressure.",
        narration: "By Boyle's Law (P₁V₁ = P₂V₂), expanding chest volume creates a slight sub-atmospheric gradient (-1 to -3 mmHg) that draws air into the alveoli.",
        formula: "P_1 V_1 = P_2 V_2",
        simulationType: "heart",
        interactiveLabel: "Thoracic Volume & Alveolar Pressure Simulator",
        sliderLabel: "Diaphragm Contraction Excursion",
        sliderMin: 0,
        sliderMax: 100,
        sliderDefault: 65,
        sliderUnit: "%",
        quizQuestion: "When the diaphragm contracts and moves downward during inspiration, what happens to alveolar pressure?",
        quizOptions: [
          "It drops slightly below atmospheric pressure, drawing air into the lungs",
          "It rises above atmospheric pressure",
          "Thoracic volume decreases",
          "The trachea closes",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Increased thoracic volume lowers pressure according to Boyle's Law.",
      },
    ],
  },
];

export const HISTORY_SIGNATURE_COURSES: AcademyCourseItem[] = [
  {
    slug: "smoke-steam-and-progress",
    title: "Smoke, Steam, and Progress",
    subtitle: "The Industrial Revolution",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#D97706",
    href: "/course/history/smoke-steam-and-progress/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_steam_1",
        chapterTitle: "Coal, Iron, and the Steam Engine",
        heading: "Why Britain Ignited the Industrial Revolution",
        subheading: "Abundant shallow coal seams, navigable canals, and James Watt's separate condenser transformed textile mills and rail transport.",
        narration: "Before steam power, factories were tethered to fast-flowing river valleys. Steam engines unlocked urban manufacturing centers like Manchester and Birmingham.",
        simulationType: "history",
        interactiveLabel: "Steam Engine Output & Factory Urbanization Model",
        sliderLabel: "Year",
        sliderMin: 1760,
        sliderMax: 1850,
        sliderDefault: 1815,
        sliderUnit: "CE",
        quizQuestion: "How did James Watt's separate condenser transform industrial manufacturing?",
        quizOptions: [
          "It drastically reduced coal consumption and allowed factories to be built away from rivers",
          "It replaced iron with bronze",
          "It abolished railroad transport",
          "It relied exclusively on wind power",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Watt's condenser cut fuel usage by ~75% and enabled rotary factory machinery anywhere coal could be shipped.",
      },
    ],
  },
  {
    slug: "crossing-the-ocean-wall",
    title: "Crossing the Ocean Wall",
    subtitle: "The Age of Exploration",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#0284C7",
    href: "/course/history/crossing-the-ocean-wall/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_ocean_1",
        chapterTitle: "Caravels, Trade Winds, and the Columbian Exchange",
        heading: "Navigating the Atlantic Gyre",
        subheading: "Portuguese and Spanish mariners combined lateen sails, astrolabes, and knowledge of the Volta do Mar wind currents to link hemispheres.",
        narration: "Oceanic voyages connected Afro-Eurasia and the Americas, triggering the Columbian Exchange of crops, silver, peoples, and pathogens.",
        simulationType: "history",
        interactiveLabel: "Maritime Wind Currents & Trade Route Simulator",
        sliderLabel: "Voyage Year",
        sliderMin: 1450,
        sliderMax: 1600,
        sliderDefault: 1492,
        sliderUnit: "CE",
        quizQuestion: "What navigation technique allowed 15th-century Iberian sailors to return safely against coastal headwinds?",
        quizOptions: ["Volta do Mar ('turn of the sea') using mid-ocean wind gyres", "Rowing with oars across the Atlantic", "Submarine travel", "Following Arctic ice bridges"],
        quizCorrectIndex: 0,
        quizExplanation: "Mariners sailed west into the Atlantic to catch the prevailing westerlies home.",
      },
    ],
  },
  {
    slug: "four-fuses-and-a-spark",
    title: "Four Fuses and a Spark",
    subtitle: "The Outbreak of World War I",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#DC2626",
    href: "/course/history/four-fuses-and-a-spark/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_ww1_1",
        chapterTitle: "Militarism, Alliances, Imperialism, Nationalism",
        heading: "How Sarajevo Triggered a Continental Chain Reaction",
        subheading: "Rigid mobilization timetables and interlocking treaties turned a regional Balkan crisis in July 1914 into a global war.",
        narration: "Within five weeks of the assassination of Archduke Franz Ferdinand, the Triple Entente and Central Powers were locked in industrial warfare.",
        simulationType: "history",
        interactiveLabel: "July 1914 Alliance Escalation Timeline",
        sliderLabel: "July–August 1914 Day",
        sliderMin: 1,
        sliderMax: 37,
        sliderDefault: 30,
        sliderUnit: "day",
        quizQuestion: "Why did local conflict between Austria-Hungary and Serbia escalate into a continent-wide war in 1914?",
        quizOptions: [
          "Interlocking alliance treaties and rigid railway mobilization schedules pulled major powers in sequentially",
          "The United Nations ordered global mobilization",
          "Nuclear weapons were deployed",
          "Britain invaded South America",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Alliance commitments and inflexible military timetables left diplomats little room to halt mobilization.",
      },
    ],
  },
  {
    slug: "the-price-of-ending-war",
    title: "The Price of Ending War",
    subtitle: "The Pacific War",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#7C3AED",
    href: "/course/history/the-price-of-ending-war/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_pacific_1",
        chapterTitle: "Island Hopping & the Atomic Threshold",
        heading: "Strategic Decisions in the Pacific Theater (1941–1945)",
        subheading: "From Midway to Okinawa, amphibious campaigns and submarine blockades culminated in the dawn of the nuclear age.",
        narration: "Examine how naval logistics, codebreaking, and strategic bombing reshaped the end of World War II.",
        simulationType: "history",
        interactiveLabel: "Pacific Theater Strategic Range & Logistics Map",
        sliderLabel: "Campaign Year",
        sliderMin: 1941,
        sliderMax: 1945,
        sliderDefault: 1944,
        sliderUnit: "CE",
        quizQuestion: "What was the core objective of the Allied 'island-hopping' strategy in the Pacific?",
        quizOptions: [
          "Bypassing heavily fortified Japanese garrisons to seize key airfields and supply bases closer to the home islands",
          "Capturing every single island in numerical order",
          "Fighting only with battleships and avoiding aircraft carriers",
          "Abandoning naval logistics",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Leapfrogging isolated strongholds conserved lives and accelerated the advance of air and naval range.",
      },
    ],
  },
  {
    slug: "from-samurai-to-smokestacks",
    title: "From Samurai to Smoke",
    subtitle: "Meiji Restoration",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#E11D48",
    href: "/course/history/from-samurai-to-smokestacks/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_meiji_1",
        chapterTitle: "Abolishing Feudal Domains & Rapid Industrialization",
        heading: "How Japan Transformed in a Single Generation (1868–1905)",
        subheading: "Following the Charter Oath of 1868, Meiji reformers replaced feudal Tokugawa domains with prefectures, universal schooling, railways, and modern shipyards.",
        narration: "By synthesizing Western industrial technology with centralized state institutions, Meiji Japan emerged as Asia's first industrial power.",
        simulationType: "history",
        interactiveLabel: "Meiji Industrial & Rail Network Growth",
        sliderLabel: "Meiji Year",
        sliderMin: 1868,
        sliderMax: 1912,
        sliderDefault: 1889,
        sliderUnit: "CE",
        quizQuestion: "Which political change enabled Meiji Japan to unify its tax base and modernize its military?",
        quizOptions: [
          "Abolishing feudal han domains and replacing them with centralized prefectures",
          "Closing all ports to foreign trade",
          "Banning steam locomotives",
          "Restoring the Tokugawa shogunate",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Centralizing taxation and governance allowed nationwide infrastructure and education investment.",
      },
    ],
  },
  {
    slug: "from-versailles-to-warsaw",
    title: "From Versailles to Warsaw",
    subtitle: "The Outbreak of World War II",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#4F46E5",
    href: "/course/history/from-versailles-to-warsaw/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_ww2_1",
        chapterTitle: "The Interwar Crisis & Appeasement",
        heading: "How the Post-1919 Peace Unraveled",
        subheading: "Great Depression shocks, League of Nations paralysis, and unchecked territorial aggression in Manchuria, Ethiopia, the Rhineland, and Czechoslovakia led to September 1939.",
        narration: "Trace each diplomatic turning point between 1919 and the invasion of Poland in 1939.",
        simulationType: "history",
        interactiveLabel: "Interwar Crisis Escalation Explorer (1919–1939)",
        sliderLabel: "Year",
        sliderMin: 1919,
        sliderMax: 1939,
        sliderDefault: 1938,
        sliderUnit: "CE",
        quizQuestion: "Which 1938 agreement ceded the Czechoslovak Sudetenland in a failed attempt to prevent war?",
        quizOptions: ["The Munich Agreement", "The Treaty of Ghent", "The Congress of Vienna", "The Yalta Conference"],
        quizCorrectIndex: 0,
        quizExplanation: "The Munich Agreement of September 1938 epitomized appeasement and emboldened further Axis expansion.",
      },
    ],
  },
  {
    slug: "chasing-silver-across-seas",
    title: "Chasing Silver Across Seas",
    subtitle: "Global Silver Trade",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#0D9488",
    href: "/course/history/chasing-silver-across-seas/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_silver_1",
        chapterTitle: "Potosí, Manila Galleons, and the Single Whip Reform",
        heading: "The First Truly Global Currency Network (1571–1700)",
        subheading: "Ming China's Single Whip tax reform required silver bullion, drawing Spanish American silver from Potosí and Zacatecas across both the Atlantic and the Pacific via Manila.",
        narration: "When Manila was founded as a Spanish entrepôt in 1571, American silver exchanged directly for Chinese silk and porcelain.",
        simulationType: "history",
        interactiveLabel: "Global Silver Flow & Price Revolution Simulator",
        sliderLabel: "Annual Silver Tonnage",
        sliderMin: 50,
        sliderMax: 400,
        sliderDefault: 220,
        sliderUnit: "tons/yr",
        quizQuestion: "Why did Ming China become the primary sink for world silver in the late 16th century?",
        quizOptions: [
          "The Single Whip Reform consolidated land and labor taxes into a single payment required in silver",
          "China banned silk production",
          "Silver was used only for building ships",
          "Spain gifted silver without trade",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Requiring tax payments in silver created massive demand that elevated silver's value in China relative to Europe and the Americas.",
      },
    ],
  },
  {
    slug: "lied-into-the-trenches",
    title: "From Lies to the Trenches",
    subtitle: "The Road to World War I",
    category: "history",
    section: "History Signature",
    badge: "History",
    accentColor: "#9333EA",
    href: "/course/history/lied-into-the-trenches/learn?entry_source=start&from=history",
    blocks: [
      {
        id: "hist_trenches_1",
        chapterTitle: "The Illusion of the Short War",
        heading: "'Home Before the Leaves Fall'",
        subheading: "Generals planned for swift 19th-century decisive battles, but machine guns, rapid-fire artillery, and barbed wire locked millions into trench stalemate along the Western Front.",
        narration: "Explore why offensive doctrines collided catastrophically with defensive industrial firepower in 1914.",
        simulationType: "history",
        interactiveLabel: "Western Front Defensive Firepower vs Mobility Lab",
        sliderLabel: "Artillery Density",
        sliderMin: 10,
        sliderMax: 200,
        sliderDefault: 120,
        sliderUnit: "guns/km",
        quizQuestion: "Why did the Western Front solidify into trench warfare by late autumn 1914?",
        quizOptions: [
          "Machine guns, quick-firing artillery, and rail-supplied reserves gave defenders overwhelming advantage over exposed infantry",
          "Both sides ran out of soldiers in August 1914",
          "Tanks dominated the battlefield in August 1914",
          "Airplanes prevented troops from marching",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Industrial firepower made open-ground assaults devastatingly costly, forcing armies underground.",
      },
    ],
  },
];

export const SUGGESTED_COURSE_TOPICS = [
  "Perimeter and Area of Rectangles",
  "Rocks, Minerals and the Rock Cycle",
  "Goods and Services",
  "Newton's Second Law & Free-Body Diagrams",
  "Quadratic Formula & Discriminant Intuition",
  "DNA Replication & Okazaki Fragments",
  "Supply, Demand, and Market Equilibrium",
  "The French Revolution & Declaration of Rights",
  "Bayes' Theorem and Conditional Probability",
];

export function findCourseOrLesson(category: string, slug: string): AcademyCourseItem {
  const allStatic = [...SCIENCE_COURSES, ...HISTORY_SIGNATURE_COURSES];
  const exact = allStatic.find((c) => c.slug === slug);
  if (exact) return exact;

  // Check if it is a math lesson or unit
  const prettyTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return buildCustomAiCourse(prettyTitle, category as AcademyCourseItem["category"], slug);
}

export function buildCustomAiCourse(
  topic: string,
  category: AcademyCourseItem["category"] = "my",
  customSlug?: string
): AcademyCourseItem {
  const cleanTitle = topic.trim() || "Interactive AI Study Course";
  const slug =
    customSlug ||
    cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
      "-" +
      Date.now().toString(36).slice(-4);

  return {
    slug,
    title: cleanTitle,
    subtitle: `Interactive AI-generated visual course on ${cleanTitle}`,
    category,
    section: category === "math" ? "Math Curriculum" : "AI Custom Course",
    badge: category === "math" ? "Math" : "AI Course",
    accentColor: "#FF3B30",
    href: `/course/${category}/${slug}/learn?entry_source=start&from=${category}`,
    blocks: [
      {
        id: `${slug}-block-1`,
        chapterTitle: "Core Intuition",
        heading: `Understanding ${cleanTitle} Visually`,
        subheading: `Before memorizing formulas or definitions, let's build a clear mental model of how ${cleanTitle} works from first principles.`,
        narration: `Welcome to your personalized Gauth Academy lesson on ${cleanTitle}. Use the interactive parameter slider to observe how changing the input transforms the system in real time.`,
        formula: "f(x) = a \\cdot x^2 + b \\cdot x + c",
        simulationType: category === "math" ? "math" : "flight",
        interactiveLabel: `${cleanTitle} — Interactive Parameter Explorer`,
        sliderLabel: "Parameter Scale k",
        sliderMin: 1,
        sliderMax: 100,
        sliderDefault: 50,
        sliderUnit: "units",
        quizQuestion: `What is the primary benefit of analyzing ${cleanTitle} through step-by-step invariants?`,
        quizOptions: [
          "It connects visual intuition directly to formal symbolic reasoning",
          "It avoids checking boundary conditions",
          "It only works for single-variable constants",
          "It ignores unit consistency",
        ],
        quizCorrectIndex: 0,
        quizExplanation: `Combining visual models with algebraic invariants ensures deep mastery of ${cleanTitle}.`,
      },
      {
        id: `${slug}-block-2`,
        chapterTitle: "Step-by-Step Mechanism",
        heading: `Key Relationships in ${cleanTitle}`,
        subheading: `Observe how rate of change, proportionality, and conservation laws govern ${cleanTitle}.`,
        narration: `In this second block, test extreme values on the canvas and verify that your prediction matches the simulation curve.`,
        formula: "\\Delta y = \\int_{x_0}^{x_1} f'(x)\\,dx",
        simulationType: "math",
        interactiveLabel: `${cleanTitle} — Rate & Accumulation Canvas`,
        sliderLabel: "Input Variable x",
        sliderMin: 0,
        sliderMax: 50,
        sliderDefault: 20,
        sliderUnit: "x",
        quizQuestion: `When the rate of change in ${cleanTitle} is positive and constant, how does the output behave?`,
        quizOptions: [
          "It grows linearly at a steady slope",
          "It decays to zero immediately",
          "It remains undefined",
          "It oscillates with decreasing period",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "A constant positive rate of change produces linear growth with slope equal to that rate.",
      },
      {
        id: `${slug}-block-3`,
        chapterTitle: "Mastery Synthesis",
        heading: `Applying ${cleanTitle} to Real-World Scenarios`,
        subheading: `Synthesize the concepts from earlier blocks to solve multi-step exam problems with confidence.`,
        narration: `You've reached the synthesis stage! Review the summary diagram or ask the built-in AI Tutor any follow-up question below.`,
        simulationType: "math",
        interactiveLabel: `${cleanTitle} — Mastery Verification Lab`,
        sliderLabel: "Scenario Complexity",
        sliderMin: 1,
        sliderMax: 10,
        sliderDefault: 5,
        sliderUnit: "lvl",
        quizQuestion: `Which strategy is most reliable when solving a complex problem involving ${cleanTitle}?`,
        quizOptions: [
          "Identify knowns/unknowns, map to the governing principle, solve step-by-step, and verify units",
          "Guess a numerical answer without writing intermediate steps",
          "Skip reading the problem constraints",
          "Round all numbers to zero before calculating",
        ],
        quizCorrectIndex: 0,
        quizExplanation: "Structured decomposition prevents algebraic slips and makes verification straightforward.",
      },
    ],
  };
}

export interface NormalizedCourseBlock {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  narration: string;
  formula: string;
  parameterLabel: string;
  parameterUnit: string;
  minVal: number;
  maxVal: number;
  defaultVal: number;
  checkQuestion: string;
  checkChoices: string[];
  correctChoiceIndex: number;
}

export interface NormalizedAcademyCourse {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: "science" | "math" | "history" | "my";
  section: string;
  badge: string;
  accentColor: string;
  href: string;
  blocks: NormalizedCourseBlock[];
}

function normalizeCourseBlocks(
  rawBlocks: CourseLessonBlock[],
  courseTitle: string
): NormalizedCourseBlock[] {
  const padded = [...rawBlocks];
  while (padded.length < 6) {
    const idx = padded.length + 1;
    const template = rawBlocks[0];
    padded.push({
      id: `${template?.id || "block"}-${idx}`,
      chapterTitle: `Step ${idx}: Deep Dive & Synthesis`,
      heading: `${courseTitle} — Stage ${idx}`,
      subheading: `Interactive exploration of stage ${idx} parameters and boundary behavior.`,
      narration: `In Block ${idx} of ${courseTitle}, adjust the parameter slider to observe how the system responds across its domain and verify the governing relationship.`,
      formula: template?.formula || "y = f(x)",
      simulationType: template?.simulationType || "math",
      interactiveLabel: `${courseTitle} Stage ${idx} Simulator`,
      sliderLabel: template?.sliderLabel || "Parameter",
      sliderMin: template?.sliderMin ?? 0,
      sliderMax: template?.sliderMax ?? 100,
      sliderDefault: template?.sliderDefault ?? 50,
      sliderUnit: template?.sliderUnit || "units",
      quizQuestion:
        template?.quizQuestion ||
        `What is the key takeaway of Block ${idx} in ${courseTitle}?`,
      quizOptions: template?.quizOptions || [
        "Changing the input parameter shifts the system output predictably according to the governing law",
        "The output never depends on the input parameter",
        "Boundary conditions have no effect",
        "Units can be ignored",
      ],
      quizCorrectIndex: template?.quizCorrectIndex ?? 0,
      quizExplanation:
        template?.quizExplanation ||
        "The simulation demonstrates the direct quantitative relationship between input and output.",
    });
  }

  return padded.slice(0, 6).map((b, i) => ({
    id: b.id,
    index: i + 1,
    title: b.heading || b.chapterTitle,
    subtitle: b.chapterTitle,
    narration: `${b.subheading} ${b.narration}`,
    formula: b.formula || "f(x) = k \\cdot x",
    parameterLabel: b.sliderLabel,
    parameterUnit: b.sliderUnit,
    minVal: b.sliderMin,
    maxVal: b.sliderMax,
    defaultVal: b.sliderDefault,
    checkQuestion: b.quizQuestion,
    checkChoices: b.quizOptions,
    correctChoiceIndex: b.quizCorrectIndex,
  }));
}

function toNormalizedCourse(c: AcademyCourseItem): NormalizedAcademyCourse {
  return {
    ...c,
    description: c.subtitle,
    blocks: normalizeCourseBlocks(c.blocks, c.title),
  };
}

export const SCIENCE_LABS_COURSES: NormalizedAcademyCourse[] =
  SCIENCE_COURSES.map(toNormalizedCourse);

export const SUGGESTED_COURSE_PROMPTS = SUGGESTED_COURSE_TOPICS;

export function buildCourseBlocks(
  topic: string,
  category = "my"
): NormalizedCourseBlock[] {
  const built = buildCustomAiCourse(
    topic,
    (category as AcademyCourseItem["category"]) || "my"
  );
  return normalizeCourseBlocks(built.blocks, built.title);
}

export function findCourseByCategoryAndSlug(
  category: string,
  slug: string
): NormalizedAcademyCourse {
  const found = findCourseOrLesson(category, slug);
  return toNormalizedCourse(found);
}

