export const trackMeta = {
  title: "Developer Experience",
  description:
    "How developer tools succeed or fail based on usability — including installation friction, error clarity, and reducing the debugging burden through thoughtful design.",
};

export const lessons = [

  {
    slug: "install-friction",
    title: "Install Friction",
    order: 1,
    summary:
      "Study how installation complexity affects adoption, support burden, and perceived quality of developer tools.",
  },
  {
    slug: "actionable-errors",
    title: "Actionable Errors",
    order: 2,
    summary:
      "Study how clear error messages reduce support burden and improve developer trust.",
  },
] as const;