export const trackMeta = {
  title: "TypeScript + Node CLI",
  description:
    "How to build and ship production-ready CLI tools with Node.js and TypeScript — including command structure, packaging, distribution, and how design decisions impact real-world usage and debugging.",
};

export const lessons = [

  {
    slug: "building-a-cli",
    title: "Building a CLI",
    order: 1,
    summary:
      "Learn the basic structure of a Node.js and TypeScript command-line application.",
  },
  {
    slug: "cli-frameworks",
    title: "CLI Frameworks",
    order: 2,
    summary:
      "Compare common Node CLI frameworks and understand how they shape command design.",
  },
] as const;