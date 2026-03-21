import { getAllTracks, getLessonsByTrack } from "@/lib/content";
import HomeDashboard from "@/components/HomeDashboard";

export default async function HomePage() {
  const tracks = await getAllTracks();

  const trackData = await Promise.all(
    tracks.map(async (track) => {
      const lessons = await getLessonsByTrack(track.track);

      return {
        ...track,
        lessons,
      };
    })
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <HomeDashboard tracks={trackData} />
    </main>
  );
}