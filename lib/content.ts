import { trackOrder, type TrackKey } from "../content/track";

export type LessonMeta = {
  track: TrackKey;
  slug: string;
  title: string;
  summary: string;
  order: number;
  duration?: string;
  difficulty?: string;
};

export type TrackMeta = {
  track: TrackKey;
  title: string;
  description: string;
};

type TrackManifest = {
  trackMeta: {
    title: string;
    description: string;
  };
  lessons: Array<{
    slug: string;
    title: string;
    order: number;
    summary: string;
    duration?: string;
    difficulty?: string;
  }>;
};

async function getTrackManifest(track: TrackKey): Promise<TrackManifest> {
  return await import(`../content/${track}/meta`);
}

export async function getAllTracks(): Promise<TrackMeta[]> {
  return await Promise.all(
    trackOrder.map(async (track) => {
      const manifest = await getTrackManifest(track);

      return {
        track,
        title: manifest.trackMeta.title,
        description: manifest.trackMeta.description,
      };
    })
  );
}

export async function getLessonsByTrack(track: TrackKey): Promise<LessonMeta[]> {
  const manifest = await getTrackManifest(track);

  return manifest.lessons
    .map((lesson) => ({
      track,
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      order: lesson.order,
      duration: lesson.duration,
      difficulty: lesson.difficulty,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getAllLessons(): Promise<LessonMeta[]> {
  const allLessons = await Promise.all(
    trackOrder.map(async (track) => getLessonsByTrack(track))
  );

  return allLessons.flat();
}

export async function getTrackInfo(track: TrackKey): Promise<TrackMeta> {
  const manifest = await getTrackManifest(track);

  return {
    track,
    title: manifest.trackMeta.title,
    description: manifest.trackMeta.description,
  };
}

export async function getLessonNavigation(track: TrackKey, slug: string) {
  const lessons = await getLessonsByTrack(track);
  const index = lessons.findIndex((lesson) => lesson.slug === slug);

  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}