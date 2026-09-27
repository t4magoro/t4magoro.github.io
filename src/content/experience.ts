export type Quest = {
  role: string;
  org: string;
  period: string;
  /** true = current job ("In progress"), false = finished ("Cleared"). */
  active: boolean;
  points: string[];
};

// Newest first.
export const quests: Quest[] = [
  {
    role: "Customer Relations Officer",
    org: "PT Uniguard Indonesia · Bandung",
    period: "Nov 2025 – now",
    active: true,
    points: [
      "Run the project lifecycle end to end, from operational workflow to handover.",
      "Main contact for clients: resolve complaints and keep them updated.",
      "Work with engineering to integrate hardware and software and cut downtime.",
      "Assess risk in every project phase.",
    ],
  },
  {
    role: "Project Controller Intern",
    org: "PT Huawei Tech Investment · Jakarta",
    period: "Sep 2024 – Mar 2025",
    active: false,
    points: [
      "Cellular infrastructure projects for XL and IOH (West Java) and Telkomsel (Jabodetabek).",
      "Coordinated new network deployments and infrastructure dismantling.",
      "Supervised subcontractors on antenna dismantling and site relocation.",
      "Validated Acceptance Test Procedures (ATP) and approved milestones.",
    ],
  },
  {
    role: "Laboratory Assistant",
    org: "Basic Computing Lab, Telkom University",
    period: "Jan 2022 – Jun 2024",
    active: false,
    points: [
      "Taught Algorithm & Programming in C to first-year students.",
      "Coordinated and graded final projects and exams.",
    ],
  },
  {
    role: "B.Sc. Electrical Engineering",
    org: "Telkom University · GPA 3.58",
    period: "Graduated 2025",
    active: false,
    points: ["Thesis research on hand-sign classification with FMCW radar, published at IEEE."],
  },
];

export const achievements: string[] = [
  "IEEE publication: SIBI alphabet hand-sign classification with CNN and FMCW radar",
  "Presenter at the IEEE symposium on future telecommunication, Lombok",
  "Top 8, PLN Innovation Competition 2023",
  "International Community Service Program 2023, Universiti Teknologi MARA",
  "Google IT Support certificate",
];