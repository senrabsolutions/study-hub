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
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "tls-debugging",
    title: "Debugging TLS and Certificate Errors in CLI Tools",
    order: 2,
    summary:
      "How to diagnose UNABLE_TO_VERIFY_LEAF_SIGNATURE, SELF_SIGNED_CERT_IN_CHAIN, and corporate proxy TLS interception — the real errors Windows users encounter.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
] as const;
