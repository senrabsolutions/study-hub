import { notFound } from "next/navigation";
import TrackOverview from "@/components/TrackOverview";
import TrackSidebar from "@/components/TrackSidebar";
import { isValidTrack } from "@/content/track";
import { getLessonsByTrack, getTrackInfo } from "@/lib/content";

type TrackPageProps = {
  params: Promise<{ track: string }>;
};

export default async function TrackPage({ params }: TrackPageProps) {
  const { track } = await params;

  if (!isValidTrack(track)) {
    notFound();
  }

  const trackInfo = await getTrackInfo(track);
  const lessons = await getLessonsByTrack(track);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <TrackSidebar
          track={track}
          trackTitle={trackInfo.title}
          trackDescription={trackInfo.description}
          lessons={lessons}
        />

        <div className="min-w-0">
          <TrackOverview
            track={track}
            trackTitle={trackInfo.title}
            trackDescription={trackInfo.description}
            lessons={lessons}
          />
        </div>
      </div>
    </main>
  );
}