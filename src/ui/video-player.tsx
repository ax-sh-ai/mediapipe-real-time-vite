import { VideoWithOverlay } from './video-with-overlay.tsx';

export function VideoPlayer({ url }: { url: string }) {
  return <VideoWithOverlay src={url} />;
}
