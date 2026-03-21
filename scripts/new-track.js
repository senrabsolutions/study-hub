const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const contentRoot = path.join(projectRoot, "content");
const trackFilePath = path.join(contentRoot, "track.ts");
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

function validateSlug(slug, label) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(
      `Invalid ${label} "${slug}". Use lowercase letters, numbers, and hyphens only.`
    );
  }
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

function buildMetaContent(trackTitle, trackDescription, firstLesson) {
  if (!firstLesson) {
    return `export const trackMeta = {
  title: "${escapeForTs(trackTitle)}",
  description:
    "${escapeForTs(trackDescription)}",
} as const;

export const lessons = [] as const;
`;
  }

  return `export const trackMeta = {
  title: "${escapeForTs(trackTitle)}",
  description:
    "${escapeForTs(trackDescription)}",
} as const;

export const lessons = [
  {
    slug: "${escapeForTs(firstLesson.slug)}",
    title: "${escapeForTs(firstLesson.title)}",
    order: 1,
    summary:
      "${escapeForTs(firstLesson.summary)}",
    duration: "10 min",
    difficulty: "Beginner",
  },
] as const;
`;
}

function buildLessonContent(title, summary) {
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

function insertTrackIntoTrackFile(trackFileContent, trackSlug) {
  if (trackFileContent.includes(`"${trackSlug}"`)) {
    return trackFileContent;
  }

  const pattern = /export const trackOrder = \[([\s\S]*?)\] as const;/;
  const match = trackFileContent.match(pattern);

  if (!match) {
    throw new Error("Could not find trackOrder array in content/track.ts");
  }

  const existingBody = match[1].trimEnd();
  const newEntryLine = `  "${trackSlug}",`;

  const replacement = `export const trackOrder = [
${existingBody ? `${existingBody}\n` : ""}${newEntryLine}
] as const;`;

  return trackFileContent.replace(pattern, replacement);
}

function main() {
  const [
    ,
    ,
    trackSlug,
    rawTrackTitle,
    rawTrackDescription,
    firstLessonSlug,
    rawFirstLessonTitle,
    rawFirstLessonSummary,
  ] = process.argv;

  if (!trackSlug) {
    console.log(
      "Usage: node scripts/new-track.js <track-slug> [track-title] [track-description] [first-lesson-slug] [first-lesson-title] [first-lesson-summary]"
    );
    process.exit(1);
  }

  validateSlug(trackSlug, "track slug");

  if (firstLessonSlug) {
    validateSlug(firstLessonSlug, "lesson slug");
  }

  const trackTitle = rawTrackTitle || titleFromSlug(trackSlug);
  const trackDescription =
    rawTrackDescription ||
    "Describe what this track teaches and how it supports Windows CLI engineering.";

  const trackDir = path.join(contentRoot, trackSlug);
  const metaPath = path.join(trackDir, "meta.ts");

  if (fs.existsSync(trackDir)) {
    throw new Error(`Track folder already exists: content/${trackSlug}`);
  }

  let firstLesson = null;

  if (firstLessonSlug) {
    firstLesson = {
      slug: firstLessonSlug,
      title: rawFirstLessonTitle || titleFromSlug(firstLessonSlug),
      summary:
        rawFirstLessonSummary ||
        "Explain what this lesson teaches and what problem it helps solve.",
    };
  }

  fs.mkdirSync(trackDir, { recursive: true });

  const metaContent = buildMetaContent(
    trackTitle,
    trackDescription,
    firstLesson
  );
  writeFileSafe(metaPath, metaContent);

  console.log(`Created: content/${trackSlug}/meta.ts`);

  if (firstLesson) {
    const lessonPath = path.join(trackDir, `${firstLesson.slug}.mdx`);
    const lessonContent = buildLessonContent(
      firstLesson.title,
      firstLesson.summary
    );
    writeFileSafe(lessonPath, lessonContent);

    console.log(`Created: content/${trackSlug}/${firstLesson.slug}.mdx`);
  }

  const trackFileContent = readFileSafe(trackFilePath);
  if (!trackFileContent) {
    throw new Error("Missing content/track.ts");
  }

  const updatedTrackFile = insertTrackIntoTrackFile(trackFileContent, trackSlug);
  writeFileSafe(trackFilePath, updatedTrackFile);

  console.log("Updated: content/track.ts");
  console.log("Track creation complete.");
}

main();