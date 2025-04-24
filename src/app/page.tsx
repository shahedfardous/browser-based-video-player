import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Media Player</h1>
      <VideoPlayer />
    </main>
  );
}