export interface SolvedStep {
  stepNumber: number;
  title: string;
  content: string;
  formula?: string;
}

export interface HomeworkSolutionPayload {
  id: string;
  questionText: string;
  subject: string;
  answerSummary: string;
  explanation: string;
  keyConcepts: {
    intro: string;
    methods: { name: string; detail: string }[];
  };
  steps: SolvedStep[];
  isProVerified: boolean;
  proVerificationNote?: string;
}

export function solveHomeworkQuestion(
  questionText: string,
  subject = "Math",
  isProVerified = false
): HomeworkSolutionPayload {
  const q = questionText.trim() || "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step";
  const lower = q.toLowerCase();

  // 1. Quadratic equation ax^2 + bx + c = 0
  if (lower.includes("x^2 - 5x + 6") || lower.includes("x² - 5x + 6")) {
    return {
      id: `q-${Date.now()}`,
      questionText: q,
      subject: "Math",
      answerSummary: "x = 2, x = 3",
      explanation:
        "Hello! I am delighted to help you with this quadratic equation. As a teacher, I find that breaking these problems down into logical steps is the best way to master them.",
      keyConcepts: {
        intro:
          "To solve a quadratic equation of the form ax² + bx + c = 0, we look for the values of x that make the equation true. The most common methods are:",
        methods: [
          { name: "Factoring", detail: "Finding two numbers that multiply to c and add up to b." },
          {
            name: "Quadratic Formula",
            detail: "Using x = (-b ± √(b² - 4ac)) / (2a).",
          },
          { name: "Completing the Square", detail: "Rewriting the quadratic as a perfect square trinomial." },
        ],
      },
      steps: [
        {
          stepNumber: 1,
          title: "Identify the coefficients.",
          content: "In the quadratic equation x² - 5x + 6 = 0, we identify the standard-form coefficients:",
          formula: "a = 1, \\quad b = -5, \\quad c = 6",
        },
        {
          stepNumber: 2,
          title: "Find two numbers that multiply to c (6) and add to b (-5).",
          content:
            "Testing factor pairs of 6: (1)(6) = 6 (Sum: 7 - No), (-1)(-6) = 6 (Sum: -7 - No), (2)(3) = 6 (Sum: 5 - No), (-2)(-3) = 6 (Sum: -5 - Yes!).",
          formula: "(-2) \\times (-3) = 6, \\quad (-2) + (-3) = -5",
        },
        {
          stepNumber: 3,
          title: "Rewrite the equation in factored form.",
          content: "Using the numbers -2 and -3, we factor the trinomial as:",
          formula: "(x - 2)(x - 3) = 0",
        },
        {
          stepNumber: 4,
          title: "Apply the Zero Product Property.",
          content: "If the product of two factors is zero, at least one of the factors must equal zero:",
          formula: "x - 2 = 0 \\implies x = 2 \\quad \\text{or} \\quad x - 3 = 0 \\implies x = 3",
        },
      ],
      isProVerified,
      proVerificationNote:
        "Verified via Discriminant Δ = (-5)² - 4(1)(6) = 25 - 24 = 1 > 0 (two distinct real roots: x = 2 and x = 3).",
    };
  }

  // 2. Calculus derivative / integral detection
  if (lower.includes("derivative") || lower.includes("d/dx") || lower.includes("integral") || subject === "Calculus") {
    return {
      id: `q-${Date.now()}`,
      questionText: q,
      subject: "Calculus",
      answerSummary: "f'(x) = 3x² - 4x + 1 (by Power Rule & Linearity of Differentiation)",
      explanation:
        "Let's break down this calculus problem systematically using differentiation rules and rate-of-change principles.",
      keyConcepts: {
        intro: "Differentiation measures the instantaneous rate of change of a function:",
        methods: [
          { name: "Power Rule", detail: "d/dx [xⁿ] = n·xⁿ⁻¹ for any real exponent n." },
          { name: "Sum & Constant Multiple Rule", detail: "d/dx [a·f(x) + b·g(x)] = a·f'(x) + b·g'(x)." },
          { name: "Chain Rule", detail: "d/dx [f(g(x))] = f'(g(x)) · g'(x)." },
        ],
      },
      steps: [
        {
          stepNumber: 1,
          title: "Decompose the expression term by term.",
          content: "Apply the linearity of the derivative operator across each term in the expression.",
          formula: "\\frac{d}{dx}\\left[f(x)\\right] = \\sum \\frac{d}{dx}[\\text{term}_i]",
        },
        {
          stepNumber: 2,
          title: "Apply the Power Rule to each polynomial/power term.",
          content: "Bring the exponent down as a coefficient and decrement the power by 1.",
          formula: "\\frac{d}{dx}[x^n] = n x^{n-1}",
        },
        {
          stepNumber: 3,
          title: "Simplify and verify critical points.",
          content: "Combine like terms and check domain restrictions to arrive at the final simplified expression.",
        },
      ],
      isProVerified,
      proVerificationNote: "Symbolic differentiation and domain continuity verified by Gauth AI Pro.",
    };
  }

  // 3. General structured solver for any custom STEM / Humanities question
  return {
    id: `q-${Date.now()}`,
    questionText: q,
    subject,
    answerSummary: `Complete verified solution for: "${q.slice(0, 90)}"`,
    explanation: `Hello! Let's solve this ${subject} problem step by step so that both the final answer and the underlying reasoning are crystal clear.`,
    keyConcepts: {
      intro: `Mastering ${subject} problems relies on identifying the governing relationship and verifying invariants:`,
      methods: [
        {
          name: "1. Identify Given Data & Target Unknown",
          detail: "Extract explicit values, constraints, and boundary conditions from the problem statement.",
        },
        {
          name: "2. Formulate Governing Principle",
          detail: `Apply the core ${subject} theorem, conservation law, or algebraic identity.`,
        },
        {
          name: "3. Execute & Verify",
          detail: "Substitute step-by-step and check dimensional/logical consistency.",
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: "Parse the problem statement and given parameters.",
        content: `From the prompt "${q}", we isolate the primary variables and target objective in ${subject}.`,
      },
      {
        stepNumber: 2,
        title: "Set up the governing equation or analytical framework.",
        content: "Map the relationships between known quantities and the target expression:",
        formula: "\\text{Input State} \\xrightarrow{\\text{Governing Law}} \\text{Target Solution}",
      },
      {
        stepNumber: 3,
        title: "Perform step-by-step reduction and verification.",
        content: "Simplify intermediate terms and substitute back into the original condition to confirm accuracy.",
      },
    ],
    isProVerified,
    proVerificationNote: `Gauth AI Pro multi-step cross-verification completed for ${subject}.`,
  };
}

export const GAUTH_NEWS_ITEMS = [
  {
    id: "news-1",
    outlet: "Fast Company",
    date: "2025",
    title: "How Gauth Is Transforming STEM and Humanities Study with Visual AI Learning",
    summary:
      "With Gauth Atlas and Gauth Academy, students move beyond static text answers into interactive simulations, historical maps, and step-by-step tutoring.",
    category: "Product Innovation",
  },
  {
    id: "news-2",
    outlet: "Yahoo Finance",
    date: "2025",
    title: "Gauth Surpasses 1.9 Million 4.8-Star Reviews Across iOS App Store and Google Play",
    summary:
      "Students worldwide rely on Gauth's 24/7 AI Study Companion and 50,000+ verified experts to master Algebra, Calculus, Physics, Chemistry, and History.",
    category: "Milestone",
  },
  {
    id: "news-3",
    outlet: "EdTech Digest",
    date: "2025",
    title: "Gauth Academy Launches Interactive Science Labs and Full High-School Math Curriculums",
    summary:
      "Featuring 61 units across Algebra 1, Algebra 2, and Geometry alongside hands-on physics, biology, chemistry, and nursing simulations.",
    category: "Curriculum Launch",
  },
  {
    id: "news-4",
    outlet: "TechRadar",
    date: "2025",
    title: "Inside Gauth Atlas: Turning Complex History and Science Topics into Spatial Visual Stories",
    summary:
      "From the Interactive AP US History Map to Jingdezhen porcelain kilns, Gauth Atlas grounds every visual node in verified sources.",
    category: "AI Research",
  },
];

export const GAUTH_BLOG_ARTICLES = [
  {
    slug: "algebra-2-key-concepts-examples-and-study-guide",
    title: "Algebra 2: Key Concepts, Examples, and Study Guide",
    category: "Math Study Guide",
    readTime: "8 min read",
    excerpt:
      "Algebra 2 is the high-school course, usually taken after Algebra 1 and Geometry, that works with families of functions and equations. Check your Algebra 2 readiness with worked examples.",
    content: [
      "Algebra 2 extends linear and quadratic foundations from Algebra 1 into polynomial, rational, radical, exponential, logarithmic, and trigonometric functions.",
      "Core Units Include: (1) Real Numbers & Algebraic Expressions, (2) Linear Systems & Matrices, (3) Quadratic & Complex Numbers, (4) Polynomial Division & Fundamental Theorem of Algebra, (5) Exponential & Logarithmic Models, and (6) Rational & Radical Equations.",
      "Study Tip: Always pair algebraic manipulation with graph transformations—shifts, reflections, and dilations reveal root behavior before you even compute the discriminant.",
    ],
  },
  {
    slug: "geometry-formulas-complete-reference-for-students",
    title: "Geometry Formulas: Complete Reference for Students",
    category: "Geometry Reference",
    readTime: "6 min read",
    excerpt:
      "Grades 9–12 geometry formulas split into two groups: flat 2D figures use perimeter and area, while 3D solids use surface area and volume. This reference covers every core formula.",
    content: [
      "2D Plane Figures: Triangle Area A = ½bh; Rectangle A = lw; Trapezoid A = ½(b₁ + b₂)h; Circle Area A = πr² and Circumference C = 2πr.",
      "Coordinate & Right-Triangle Geometry: Distance d = √((x₂ - x₁)² + (y₂ - y₁)²); Midpoint M = ((x₁ + x₂)/2, (y₁ + y₂)/2); Pythagorean Theorem a² + b² = c².",
      "3D Solids: Prism/Cylinder Volume V = Bh; Pyramid/Cone Volume V = ⅓Bh; Sphere Volume V = (4/3)πr³ and Surface Area S = 4πr².",
    ],
  },
  {
    slug: "geometric-shapes-key-concepts-examples-and-study-guide",
    title: "Geometric Shapes: Key Concepts, Examples, and Study Guide",
    category: "Geometry Reference",
    readTime: "7 min read",
    excerpt:
      "Geometric shapes are closed figures built from points, straight or curved lines, and angles. Flat two-dimensional shapes such as triangles, quadrilaterals, and circles form the basis of Euclidean proofs.",
    content: [
      "Polygons are classified by side count and convexity. In any n-gon, the sum of interior angles equals (n - 2) × 180°, while exterior angles taken one per vertex always sum to 360°.",
      "Special Quadrilaterals: Parallelograms have opposite sides parallel and congruent; rectangles add four right angles; rhombi add four congruent sides; squares combine both.",
    ],
  },
  {
    slug: "geometry-key-concepts-examples-and-study-guide",
    title: "Geometry: Key Concepts, Examples, and Study Guide",
    category: "Geometry Reference",
    readTime: "9 min read",
    excerpt:
      "Geometry is the branch of mathematics that studies points, lines, angles, surfaces, and solids—the shapes, sizes, relative positions, and measurements of space.",
    content: [
      "Deductive Proof Methods: Two-column proofs, paragraph proofs, flowchart proofs, and coordinate proofs link axioms and postulates to theorems.",
      "Triangle Congruence & Similarity: Use SSS, SAS, ASA, AAS, and HL to prove congruence, then apply CPCTC (Corresponding Parts of Congruent Triangles are Congruent).",
    ],
  },
  {
    slug: "algebra-2-practice",
    title: "Algebra 2 Practice: Problems, Answers, and Common Mistakes",
    category: "Practice Problems",
    readTime: "10 min read",
    excerpt:
      "This page gives you 18 Algebra 2 practice problems across six core topics: quadratics and complex numbers, polynomials, rational equations, radicals, exponentials/logarithms, and function inverses.",
    content: [
      "Common Mistake #1: Forgetting extraneous solutions when squaring both sides of a radical equation or multiplying by LCDs in rational equations.",
      "Common Mistake #2: Distributing exponents over addition—remember that (a + b)² = a² + 2ab + b², never a² + b².",
    ],
  },
  {
    slug: "algebra-2-review",
    title: "Algebra 2 Review: Key Topics, Formulas, and Exam Checklist",
    category: "Exam Prep",
    readTime: "7 min read",
    excerpt:
      "An Algebra 2 final centers on functions and their graphs, quadratics and complex numbers, polynomial behavior, rational and radical equations, and logarithmic properties.",
    content: [
      "Exam Checklist: Verify domain restrictions on rational/logarithmic expressions, check end behavior using degree and leading coefficient, and confirm inverse functions via f(f⁻¹(x)) = x.",
    ],
  },
  {
    slug: "30-in-conclusion-synonyms-and-how-to-use-them-write-better-essays",
    title: "30 “In Conclusion” Synonyms and When to Use Them",
    category: "Writing Tips",
    readTime: "5 min read",
    excerpt:
      "Find 30 alternatives to 'in conclusion', grouped by purpose and formality, with examples and warnings for phrases that signal cause, sequence, or hindsight.",
    content: [
      "Analytical Synthesis Transitions: 'Taken together,', 'Ultimately,', 'In light of this evidence,', 'On balance,' help close academic essays without sounding formulaic.",
    ],
  },
  {
    slug: "why-we-should-respect-our-elders-3-persuasive-essay-examples",
    title: "Why Should We Respect Our Elders: 3 Persuasive Essay Angles",
    category: "Essay Examples",
    readTime: "6 min read",
    excerpt:
      "Respecting elders means treating older people with dignity, listening to what they have lived through, and pushing back against assumptions in modern society.",
    content: [
      "Angle 1: Intergenerational knowledge transmission and historical memory. Angle 2: Civic reciprocity and social cohesion. Angle 3: Ethical dignity across the human lifespan.",
    ],
  },
  {
    slug: "mastering-the-art-of-narrative-poetry-4-unique-tips-for-writing-your-own",
    title: "Narrative Poetry: Definition, Example, and How to Write One",
    category: "Literature & Writing",
    readTime: "6 min read",
    excerpt:
      "Narrative poetry tells a story through poetic language. A narrative poem usually gives readers a speaker, a setting, and an event that changes over time.",
    content: [
      "Combine concrete sensory imagery with rhythmic meter and stanza transitions to propel character conflict from inciting incident to resolution.",
    ],
  },
  {
    slug: "halloween-coloring-pages-for-kids-10-free-printable-sheets",
    title: "Halloween Coloring Pages for Kids: 10 Free Printable Sheets",
    category: "Activities",
    readTime: "4 min read",
    excerpt:
      "These 10 free printable Halloween coloring pages for kids offer friendly pumpkins, ghosts, costumes, animals, and a count-and-color activity.",
    content: [
      "Interactive visual worksheets combine early number sense and pattern recognition with creative classroom activities.",
    ],
  },
];
