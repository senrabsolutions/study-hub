const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const contentRoot = path.join(projectRoot, "content");
const lessonTemplatePath = path.join(contentRoot, "_lesson-template.mdx");

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function escapeForTs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => {
      const lower = part.toLowerCase();

      if (lower === "cmd") return "CMD";
      if (lower === "powershell") return "PowerShell";
      if (lower === "cli") return "CLI";
      if (lower === "api") return "API";
      if (lower === "ntfs") return "NTFS";
      if (lower === "acl") return "ACL";
      if (lower === "ai") return "AI";
      if (lower === "tls") return "TLS";
      if (lower === "x509" || lower === "x.509") return "X.509";
      if (lower === "vs") return "VS";

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function validateSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug);
}

function getNextLessonOrder(metaContent) {
  const matches = [...metaContent.matchAll(/order:\s*(\d+)/g)].map((m) =>
    Number(m[1])
  );

  if (matches.length === 0) return 1;
  return Math.max(...matches) + 1;
}

function insertLessonIntoMeta(metaContent, lesson) {
  const alreadyExists = metaContent.includes(`slug: "${lesson.slug}"`);
  if (alreadyExists) {
    throw new Error(`Lesson slug "${lesson.slug}" already exists in meta.ts`);
  }

  const emptyArrayPattern = /export const lessons = \[\] as const;/;

  if (emptyArrayPattern.test(metaContent)) {
    return metaContent.replace(
      emptyArrayPattern,
      `export const lessons = [
  {
    slug: "${escapeForTs(lesson.slug)}",
    title: "${escapeForTs(lesson.title)}",
    order: ${lesson.order},
    summary:
      "${escapeForTs(lesson.summary)}",
    duration: "10 min",
    difficulty: "Beginner",
  },
] as const;`
    );
  }

  const lessonsBlockPattern = /export const lessons = \[([\s\S]*?)\] as const;/;
  const match = metaContent.match(lessonsBlockPattern);

  if (!match) {
    throw new Error("Could not find lessons array in meta.ts");
  }

  const existingBody = match[1].trimEnd();

  const newEntry = `  {
    slug: "${escapeForTs(lesson.slug)}",
    title: "${escapeForTs(lesson.title)}",
    order: ${lesson.order},
    summary:
      "${escapeForTs(lesson.summary)}",
    duration: "10 min",
    difficulty: "Beginner",
  },`;

  const replacement = `export const lessons = [
${existingBody ? `${existingBody}\n` : ""}${newEntry}
] as const;`;

  return metaContent.replace(lessonsBlockPattern, replacement);
}

function buildLessonContent({ title, summary }) {
  const template = readFileSafe(lessonTemplatePath);

  if (!template) {
    throw new Error("Missing content/_lesson-template.mdx");
  }

  return template
    .replace(/^# Lesson Title/m, `# ${title}`)
    .replace(
      /Summarize the core idea in plain language so it can be quickly reviewed during interview prep\./,
      summary
    );
}

function main() {
  const [, , track, slug, rawTitle, rawSummary] = process.argv;

  if (!track || !slug) {
    console.log(
      "Usage: node scripts/new-lesson.js <track> <lesson-slug> [title] [summary]"
    );
    process.exit(1);
  }

  if (!validateSlug(slug)) {
    throw new Error(
      `Invalid lesson slug "${slug}". Use lowercase letters, numbers, and hyphens only.`
    );
  }

  const title = rawTitle || titleFromSlug(slug);
  const summary =
    rawSummary ||
    "Explain what this lesson teaches and what problem it helps solve.";

  const trackDir = path.join(contentRoot, track);
  const metaPath = path.join(trackDir, "meta.ts");
  const lessonPath = path.join(trackDir, `${slug}.mdx`);

  if (!fs.existsSync(trackDir)) {
    throw new Error(`Track folder does not exist: content/${track}`);
  }

  const metaContent = readFileSafe(metaPath);
  if (!metaContent) {
    throw new Error(`Missing meta.ts for track: content/${track}/meta.ts`);
  }

  if (fs.existsSync(lessonPath)) {
    throw new Error(`Lesson file already exists: content/${track}/${slug}.mdx`);
  }

  const order = getNextLessonOrder(metaContent);

  const lesson = {
    slug,
    title,
    summary,
    order,
  };

  const updatedMeta = insertLessonIntoMeta(metaContent, lesson);
  writeFileSafe(metaPath, updatedMeta);

  const lessonContent = buildLessonContent({ title, summary });
  writeFileSafe(lessonPath, lessonContent);

  console.log(`Created lesson file: content/${track}/${slug}.mdx`);
  console.log(`Updated meta file: content/${track}/meta.ts`);
  console.log(`Assigned lesson order: ${order}`);
}

main();