export const trackMeta = {
  title: "Certificates and TLS",
  description:
    "How certificate trust, X.509 chains, and TLS validation impact CLI tools — including debugging SSL errors, trust store issues, and secure communication on Windows.",
};

export const lessons = [
  {
    slug: "x509-basics",
    title: "X.509 Basics",
    order: 1,
    summary:
      "Learn the basic purpose of X.509 certificates and why they matter for secure Windows tooling.",
  },
] as const;
