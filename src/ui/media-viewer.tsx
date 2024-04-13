import { useMemo } from 'react';

import { useAppStore } from '../store.ts';
import { VideoPlayer } from './video-player.tsx';

export function MediaViewer() {
  const mediaFilePath = useAppStore(({ mediaFilePath }) => mediaFilePath);
  const clearMediaFilePath = useAppStore(({ clearMediaFilePath }) => clearMediaFilePath);
  // @ts-ignore
  const url = useMemo(() => mediaFilePath && URL.createObjectURL(mediaFilePath), [mediaFilePath]);

  return (
    <section className={'h-dvh w-dvw bg-red-300 grid place-content-center'}>
      <button onClick={clearMediaFilePath}>Button</button>
      <VideoPlayer url={url} />
    </section>
  );
}
