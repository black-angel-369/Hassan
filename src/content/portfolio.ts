/**
 * Single source of truth for all portfolio copy.
 * Edit this file to update the site — no component changes required.
 *
 * Rules kept deliberately: no invented dates, metrics, employers, URLs,
 * credential IDs, or technologies. Add `links` only with real URLs.
 */

export type NavItem = { id: string; label: string };

export const site = {
  name: "Muhammad Hassan Nadeem",
  shortName: "Hassan Nadeem",
  initials: "MHN",
  title: "Software Engineer | Cybersecurity Analyst",
  roles: ["Software Engineer", "Cybersecurity Analyst"],
  description:
    "Muhammad Hassan Nadeem — Software Engineer and Cybersecurity Analyst from Peshawar, Pakistan, building secure applications and practical cybersecurity solutions.",
  location: "Peshawar, Pakistan",
  email: "muhammadhassannadeem37@gmail.com",
  phone: "+923219086370",
  phoneDisplay: "+92 321 9086370",
  /** CV served from /public; the download attribute sets the saved filename. */
  cv: { href: "/Hassan_Nadeem_CV.pdf", fileName: "Muhammad_Hassan_Nadeem_CV.pdf" },
  /** Add real profile URLs here (e.g. { label: "GitHub", href: "https://github.com/..." }). */
  socials: [] as { label: string; href: string }[],
} as const;

export const nav: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

export const hero = {
  eyebrow: "Software Engineer · Cybersecurity Analyst",
  headline: ["Engineering", "Secure Digital", "Experiences."],
  statement:
    "I build intelligent software solutions, explore complex security challenges, and design secure digital systems that combine innovation, performance, and protection.",
  indicators: ["Software Engineering", "Cybersecurity", "Secure Systems"],
  primaryCta: { label: "Explore My Work", href: "#projects" },
  secondaryCta: { label: "Get In Touch", href: "#contact" },
};

export const about = {
  kicker: "About",
  heading: "Writing software with an attacker’s eye and an engineer’s discipline.",
  paragraphs: [
    "I’m Muhammad Hassan Nadeem, a software engineering student and aspiring cybersecurity professional based in Peshawar, Pakistan. My work sits where those two disciplines meet: building applications that do their job well, and understanding exactly how they could be made to fail.",
    "I focus on building secure applications, identifying security weaknesses, designing resilient systems, and turning security knowledge into practical tools. Alongside development, I’ve taught cybersecurity and web development — explaining complex ideas clearly is part of how I sharpen my own understanding.",
    "My path so far spans software development, cybersecurity training, web development training, and a professional internship with Khyber Pakhtunkhwa Police.",
  ],
  facts: [
    { label: "Education", value: "BS Software Engineering", note: "In progress" },
    {
      label: "University",
      value: "City University of Science and Information Technology (CUSIT)",
      note: "Peshawar",
    },
    { label: "Location", value: "Peshawar, Pakistan", note: "Open to remote collaboration" },
    { label: "Focus", value: "Secure software & security analysis", note: "Build · Break · Harden" },
  ],
};

export type ExperienceItem = {
  role: string;
  org?: string;
  type: string;
  summary: string;
  points: string[];
  pointsLabel: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Cybersecurity Trainer",
    type: "Training & Instruction",
    summary:
      "Teaching learners how modern systems are attacked and defended — from foundational awareness to hands-on tooling.",
    pointsLabel: "Topics covered",
    points: [
      "Cybersecurity concepts and awareness",
      "Network security fundamentals",
      "Ethical hacking concepts",
      "Practical security tools and techniques",
    ],
  },
  {
    role: "Web Development Trainer",
    type: "Training & Mentorship",
    summary:
      "Guiding learners from web fundamentals to building working applications, with an emphasis on practical, hands-on development.",
    pointsLabel: "Topics covered",
    points: [
      "Web development fundamentals",
      "Frontend and backend concepts",
      "Practical web application development",
      "Mentoring and technical instruction",
    ],
  },
  {
    role: "Intern",
    org: "Khyber Pakhtunkhwa Police",
    type: "Professional Internship",
    summary: "Professional internship placement with Khyber Pakhtunkhwa Police.",
    pointsLabel: "Offices",
    points: ["CCPO Office", "SSP Operations Office"],
  },
];

export type ExpertiseIconKey = "shield" | "code" | "layers" | "network" | "brain";

export const coreExpertise: {
  title: string;
  description: string;
  icon: ExpertiseIconKey;
}[] = [
  {
    title: "Cybersecurity Solutions",
    description:
      "Assessing systems for weaknesses and building practical tooling that makes security problems visible and actionable.",
    icon: "shield",
  },
  {
    title: "Software Development",
    description:
      "Designing and writing maintainable software with clear structure, sound logic, and security considered from the start.",
    icon: "code",
  },
  {
    title: "Full-Stack Web Development",
    description:
      "Building complete web applications — interfaces, server logic, and data — that are fast, usable, and defensible.",
    icon: "layers",
  },
  {
    title: "Network Design & Security Protocols",
    description:
      "Understanding how networks are structured, how traffic flows, and how protocols and controls keep it protected.",
    icon: "network",
  },
  {
    title: "Problem Solving & Technical Analysis",
    description:
      "Breaking complex technical problems into parts, investigating root causes, and reasoning toward reliable solutions.",
    icon: "brain",
  },
];

export const skillGroups: { title: string; caption: string; items: string[] }[] = [
  {
    title: "Languages",
    caption: "Programming & data",
    items: ["Python", "JavaScript", "C++", "PHP", "SQL"],
  },
  {
    title: "Security Practice",
    caption: "Assessment & assurance",
    items: [
      "Network Security",
      "Web Application Security",
      "Vulnerability Assessment",
      "Penetration Testing",
      "Security Auditing",
    ],
  },
  {
    title: "Security Tooling",
    caption: "Analysis & testing",
    items: ["Wireshark", "Nmap", "Burp Suite", "Kali Linux"],
  },
  {
    title: "Platforms & Workflow",
    caption: "Systems & collaboration",
    items: ["Linux", "Git and GitHub"],
  },
];

export type ProjectVisualKey = "supplychain" | "threat" | "scan" | "pentest" | "dashboard";

export type Project = {
  index: string;
  name: string;
  category: string;
  description: string;
  visual: ProjectVisualKey;
  highlights: string[];
  /** Short note shown in the case study when no public link exists. */
  availability: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    index: "01",
    name: "SupplyGuard AI",
    category: "Software Supply Chain Security",
    description:
      "An intelligent software supply chain security platform designed to investigate third-party dependencies, identify suspicious package changes, and surface potential supply chain attack indicators.",
    visual: "supplychain",
    highlights: [
      "Investigation of third-party dependencies",
      "Detection of suspicious package changes",
      "Surfacing of potential supply chain attack indicators",
    ],
    availability: "Private project — presented here as a case study.",
  },
  {
    index: "02",
    name: "Scamvex AI",
    category: "AI-Powered Threat Detection",
    description:
      "An intelligent threat detection platform combining machine learning, domain intelligence, and multiple security analysis techniques to assess potentially malicious websites, URLs, domains, and IP addresses.",
    visual: "threat",
    highlights: [
      "Machine learning–driven threat assessment",
      "Domain intelligence analysis",
      "Multiple combined security analysis techniques",
      "Coverage of websites, URLs, domains, and IP addresses",
    ],
    availability: "Private project — presented here as a case study.",
  },
  {
    index: "03",
    name: "VulnScope",
    category: "AI-Assisted Vulnerability Assessment",
    description:
      "A web application security assessment platform designed to automate vulnerability discovery workflows, analyze findings, and support structured security reporting.",
    visual: "scan",
    highlights: [
      "Automated vulnerability discovery workflows",
      "Analysis of assessment findings",
      "Structured security reporting",
    ],
    availability: "Private project — presented here as a case study.",
  },
  {
    index: "04",
    name: "Penetration Testing & Security Assessments",
    category: "Cybersecurity",
    description:
      "Practical penetration testing, vulnerability assessment, and security evaluation work involving organizational systems and web applications.",
    visual: "pentest",
    highlights: [
      "Penetration testing",
      "Vulnerability assessment",
      "Security evaluation of organizational systems and web applications",
    ],
    availability:
      "Engagement details are confidential — organizations and findings are intentionally not disclosed.",
  },
  {
    index: "05",
    name: "Secure Management Systems",
    category: "Full-Stack Software Engineering",
    description:
      "Custom business management solutions focused on operational efficiency, structured data management, intuitive workflows, and secure application design.",
    visual: "dashboard",
    highlights: [
      "Operational efficiency",
      "Structured data management",
      "Intuitive workflows",
      "Secure application design",
    ],
    availability: "Client and private builds — presented here as a case study.",
  },
];

export const certifications = [
  { name: "Cybersecurity Essentials", issuer: "Cisco", track: "Security" },
  { name: "Ethical Hacker", issuer: "Cisco", track: "Offensive Security" },
  { name: "Networking Essentials", issuer: "Cisco", track: "Networking" },
] as const;

export const philosophy = {
  kicker: "Philosophy",
  heading: ["Build with precision.", "Secure with purpose."],
  body: "Great software should be more than functional. It should be reliable, thoughtfully engineered, and designed with security at its foundation.",
};

export const contact = {
  kicker: "Contact",
  heading: "Have a project in mind? Let’s build something secure.",
  body: "Whether it’s a secure application, a security assessment, or a training engagement — send a message and I’ll get back to you.",
};
