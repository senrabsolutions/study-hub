import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidTrack } from "@/content/track";
import LessonContent from "@/components/LessonContent";
import LessonProgressButton from "@/components/LessonProgressButton";
import TrackSidebar from "@/components/TrackSidebar";
import {
  getLessonNavigation,
  getLessonsByTrack,
  getTrackInfo,
} from "@/lib/content";

type LessonPageProps = {
  params: Promise<{
    track: string;
    lesson: string;
  }>;
};

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { track, lesson } = await params;

  if (!isValidTrack(track)) {
    notFound();
  }

  const trackInfo = await getTrackInfo(track);
  const mdxPath = path.join(process.cwd(), "content", track, `${lesson}.mdx`);

  if (!(await fileExists(mdxPath))) {
    notFound();
  }

  const [navigation, lessons] = await Promise.all([
    getLessonNavigation(track, lesson),
    getLessonsByTrack(track),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="mb-5 text-sm text-gray-600 dark:text-gray-400 sm:mb-6">
        <Link href={`/tracks/${track}`} className="hover:underline">
          {trackInfo.title}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <TrackSidebar
          track={track}
          trackTitle={trackInfo.title}
          trackDescription={trackInfo.description}
          lessons={lessons}
          currentLessonSlug={lesson}
        />

        <div className="min-w-0">
          <div className="mb-4">
            <LessonProgressButton track={track} slug={lesson} />
          </div>

          <article className="prose max-w-none rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8 dark:prose-invert dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <LessonContent track={track} lesson={lesson} />
          </article>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-between">
            {navigation.previous ? (
              <Link
                href={`/tracks/${navigation.previous.track}/${navigation.previous.slug}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                ← Previous: {navigation.previous.title}
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {navigation.next ? (
              <Link
                href={`/tracks/${navigation.next.track}/${navigation.next.slug}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Next Lesson: {navigation.next.title} →
              </Link>
            ) : (
              <Link
                href={`/tracks/${track}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Back to Track →
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}