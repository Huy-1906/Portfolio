export type Domain =
  | "fem"
  | "ai"
  | "robotics"
  | "web";

export const domainLabels: Record<Domain, string> = {
  fem: "Computational / FEM",
  ai: "AI / LLM",
  robotics: "Robotics",
  web: "Web",
};

export const profile = {
  name: "Lý Gia Huy",
  nameEn: "Huy Gia Ly",
  role: "Engineering Mechanics × Software × AI",
  tagline:
    "I build at the boundary of finite element analysis, software, and machine learning — from numerical tools and mesh workflows to compact ML models and 3D interfaces.",
  location: "Ho Chi Minh City, Vietnam",
  email: "giahuy196cv@gmail.com",
  links: {
    github: "https://github.com/Huy-1906",
    linkedin: "https://www.linkedin.com/in/giahuyly196/",
    researchgate: "https://www.researchgate.net/publication/401616634",
  },
};

export const about =
  "I am an Engineering Mechanics student at HCMUT on the computational track. My work sits at the intersection of finite element methods, software engineering, and machine learning. I build numerical tools, mesh workflows, and interactive systems for engineering tasks.";

export const education = {
  school: "Ho Chi Minh City University of Technology (HCMUT), VNU-HCM",
  degree:
    "B.Eng. in Engineering Mechanics — Computational / Japan Orientation Program",
  period: "Expected 2028",
  coursework: [
    "Finite Element Method",
    "Numerical Methods",
    "Linear Algebra & Matrix Computation",
    "Theoretical Mechanics",
    "Theory of Elasticity",
    "Programming for Engineers",
  ],
  languages: "English — IELTS 6.0; Japanese (study in progress)",
};

export const experience = [
  {
    role: "Computational Mechanics Researcher",
    org: "Engineering Mechanics Laboratory (Lab C2) — HCMUT",
    period: "2025 – Present",
      points: [
      "Research in computational mechanics and ML-driven engineering workflows under Dr. Nguyen Duy Khuong.",
      "Built an internal knowledge pipeline with retrieval and embeddings over research material and technical notes.",
      "Built automation tools around technical notes, code workflows, and engineering documentation.",
    ],
  },
  {
    role: "Undergraduate Researcher / ML Developer",
    org: "International Symposium on Applied Science (ISAS) 2025",
    period: "May – Oct 2025",
    points: [
      "Engineered an end-to-end Python pipeline (preprocessing → training → evaluation → post-processing) on 117,000+ activity-labeled time-series samples.",
      "Built a Bi-LSTM / Transformer ensemble reaching F1 = 0.7323 under Leave-One-Subject-Out (LOSO) validation.",
    ],
  },
];

export type Project = {
  title: string;
  domain: Domain;
  stack: string;
  link?: string;
  blurb: string;
  confidential?: boolean;
};

export const projects: Project[] = [
  // ---- Computational / FEM ----
  {
    title: "RVE Triangular Mesh Generator",
    domain: "fem",
    stack: "JavaScript · HTML5 / Canvas · FE Pre-processing",
    link: "https://huy-1906.github.io/RVE-website/",
    blurb:
      "Browser tool that decomposes a 2D representative volume element into a triangular finite-element mesh — the pre-processing step that feeds a structural solver. Awarded the Encouragement Prize, HCMUT Technical Festival 2024.",
  },
  {
    title: "2D Planar Truss Solver",
    domain: "fem",
    stack: "Python · Streamlit · NumPy · Matplotlib",
    link: "https://github.com/Huy-1906/LGH-Truss-solver",
    blurb:
      "Interactive solver assembling the global stiffness matrix to compute member forces, reactions, and tension/compression states — the displacement/stress workflow of FE post-processing.",
  },
  {
    title: "Newton–Cotes Numerical Integration",
    domain: "fem",
    stack: "Python · NumPy · Matplotlib",
    link: "https://github.com/Huy-1906/Newton-Cotes",
    blurb:
      "Composite Trapezoidal / Simpson 1/3 / Simpson 3/8 quadrature, benchmarked against analytical solutions — the basis of FE Gauss integration for element stiffness and load vectors.",
  },
  {
    title: "Computational Mechanics Study",
    domain: "fem",
    stack: "FEM · Numerical Methods · Python",
    blurb:
      "Research work on computational mechanics workflows and compact ML models. Details available on request.",
    confidential: true,
  },
  // ---- AI / LLM ----
  {
    title: "Research Automation Tools",
    domain: "ai",
    stack: "Python · Local models · Retrieval",
    blurb:
      "Automation prototypes for technical reading, notes, and engineering workflows.",
  },
  {
    title: "RAG Knowledge Base",
    domain: "ai",
    stack: "Vector embeddings · Chunking · Semantic retrieval",
    blurb:
      "Retrieval pipeline over internal research material and technical notes.",
  },
  {
    title: "Model Gateway Prototype",
    domain: "ai",
    stack: "Routing · Cost-aware model selection",
    blurb:
      "A lightweight gateway concept for routing tasks across model backends.",
  },
  // ---- Robotics ----
  {
    title: "6-Axis AI Industrial Robot Arm",
    domain: "robotics",
    stack: "Kinematics · Control · AI",
    blurb:
      "Work on a six-axis robotic arm — kinematics, control, and AI-assisted motion. Engineering-mechanics meets embedded systems.",
  },
  {
    title: "AI Local Robot",
    domain: "robotics",
    stack: "Edge AI · Embedded",
    blurb:
      "An on-device AI robot exploring local inference and autonomous behavior at the edge.",
  },
  // ---- Web ----
  {
    title: "This Portfolio",
    domain: "web",
    stack: "Next.js · React Three Fiber · Tailwind",
    link: "https://github.com/Huy-1906/Portfolio",
    blurb:
      "A modern portfolio with a minimal visual system, responsive sections, and motion-aware rendering.",
  },
];

export const skills: { group: string; items: string }[] = [
  {
    group: "Languages",
    items: "Python, C/C++, C#/.NET, JavaScript/TypeScript, MATLAB, LaTeX, Bash",
  },
  {
    group: "Machine Learning",
    items:
      "PyTorch, scikit-learn, Pandas, NumPy, SciPy (ANN, CNN, Bi-LSTM, Transformer)",
  },
  {
    group: "Scientific Computing",
    items:
      "Finite Element Method, matrix structural analysis, mesh discretization, numerical integration, Manim, VTK",
  },
  {
    group: "AI / LLM",
    items:
      "RAG, multi-agent orchestration, agentic coding, LLM routing/gateway, local models",
  },
  {
    group: "Web & 3D",
    items: "React, Next.js, Three.js / R3F, FastAPI, HTML5 / CSS3",
  },
  {
    group: "Systems & DevOps",
    items: "Ubuntu / Linux, Docker, Git (GitHub / GitLab), CMake, CLI workflows",
  },
];

export const publications = [
  {
    authors: "T. H. Nguyen, G. H. Ly, D. K. Dinh Hoang",
    title:
      "Leave-One-Subject-Out (LOSO)-Validated Ensemble of Bi-LSTM and Transformer Models for Unusual Activity Detection",
    venue: "J. Phys.: Conf. Ser. 3180, 012008 (2026), IOP Publishing",
    doi: "https://doi.org/10.1088/1742-6596/3180/1/012008",
  },
];

export const awards = [
  "IELTS Academic 6.0 (CEFR B2) — British Council, Mar 2024",
  "Encouragement Prize — HCMUT Faculty of Applied Science Technical Festival 2024",
];

export const nav = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];
