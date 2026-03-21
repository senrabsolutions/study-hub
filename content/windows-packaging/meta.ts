export const trackMeta = {
  title: "Windows Packaging",
  description:
    "How CLI tools are installed, versioned, and distributed on Windows — including package managers, update strategies, and common issues with PATH, permissions, and installation behavior.",
};

export const lessons = [

  {
    slug: "winget-basics",
    title: "winget Basics",
    order: 1,
    summary:
      "Understand the basics of Windows package installation, versioning, and distribution using winget.",
  },
  {
    slug: "chocolatey-vs-winget",
    title: "Chocolatey vs winget",
    order: 2,
    summary:
      "Compare common Windows package managers and understand where each fits.",
  },
] as const;